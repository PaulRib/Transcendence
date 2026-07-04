import { WebSocketGateway, WebSocketServer, OnGatewayConnection,
		 OnGatewayDisconnect, SubscribeMessage, ConnectedSocket, MessageBody
 } from '@nestjs/websockets';
 import { Socket, Namespace} from 'socket.io';
 import { JwtService } from '@nestjs/jwt';
 import { UsersService } from '../users/users.service';
 import { MultiplayerService } from './multiplayer.service'

 @WebSocketGateway({ cors:  { origin: process.env.FRONTEND_URL ?? 'http://localhost:5173', credentials: true },
					namespace: '/game' })
 export class MultiplayerGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server!: Namespace;

	private matchmakingQueue: Array<{userId: string, socketId: string }> = [];
	private reconnectTimeouts = new Map<string, { timeout: NodeJS.Timeout; matchId: string }>();
	private matchStarters = new Map<string, string>();

	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly multiplayerService: MultiplayerService,
	) {}

	async handleConnection(client: Socket) {
		try {
			const cookieHeader = client.handshake.headers.cookie;
        	const token = cookieHeader
				?.split(';')
				.find((c) => c.trim().startsWith('access_token='))
				?.split('=')
				.slice(1)
				.join('=');
			if (!token)
					throw new Error("No token provided");
			const payload = this.jwtService.verify(token, {secret : process.env.JWT_SECRET});
			const user = await this.usersService.getUserById(payload.sub);

			client.data.user = user;
			console.log(`Connexion reussie : ${user.username}, ${client.id}`);
			const pendingReconnect = this.reconnectTimeouts.get(user.id);
			if (pendingReconnect) {
				clearTimeout(pendingReconnect.timeout);
				console.log(`Timer de reconnexion suspendu (en attente de réintégration) pour ${user.username}`);
			}
 
			const activeMatch = await this.multiplayerService.getActiveMatchForUser(user.id);
			if (activeMatch) {
				console.log(`Partie en cours trouvée pour ${user.username}. Envoi du signal de reconnexion.`);
				const starterUserId = this.matchStarters.get(activeMatch.id);
				client.emit('active_match_found', { 
					matchId: activeMatch.id,
					matchData: activeMatch,
					starterUserId: starterUserId || null
				});
			}
		} catch (error) {
			console.log(`Connexion echouee : ${error}`);
			client.disconnect();
		}
	}

	async handleDisconnect(client: Socket) {
		console.log(`Joueur deconnecte : ${client.id}`);
		
		const user = client.data.user;
		const matchId = client.data.currentMatchId;

		this.matchmakingQueue = this.matchmakingQueue.filter(player => player.socketId !== client.id);
		if (user && matchId) {
			const activeMatch = await this.multiplayerService.getActiveMatchForUser(user.id);
			if (!activeMatch || activeMatch.id !== matchId) {
				return;
			}
			const timeout = setTimeout(async() => {
				this.reconnectTimeouts.delete(user.id);
				try {
					const winnerId = await this.multiplayerService.forfeitMatch(matchId, user.id);
					if (winnerId) {
						this.server.to(`room_${matchId}`).emit('game_over', {
							isDraw: false,
							winnerId: winnerId,
							reason: 'opponent_disconnected'
						});
						const sockets = await this.server.in(`room_${matchId}`).fetchSockets();
						for (const s of sockets) {
							s.data.currentMatchId = undefined;
						}
						this.server.in(`room_${matchId}`).socketsLeave(`room_${matchId}`);
					}
				}
				catch (error) {
					console.error(`Erreur lors du forfait de ${user.username}:`, error)
				}
			}, 60000);
			this.reconnectTimeouts.set(user.id, { timeout, matchId});
			this.server.to(`room_${matchId}`).emit('player_disconnected_grace', {
				userId: user.id,
				username: user.username,
				reconnectWindowMs: 60000
			});
		}
	}

	@SubscribeMessage('submit_guess')
	async handle_guess(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { GuessedChamp: string, matchId: string }
	) {
		try {
			const user = client.data.user;
			const starterUserId = this.matchStarters.get(data.matchId) || '';
			const result = await this.multiplayerService.processPlayerTurn(
				data.matchId, user.id, data.GuessedChamp, starterUserId
			)
			client.emit('guess_result_full', result.fullData);
			client.to(`room_${data.matchId}`).emit('guess_result_spectator', result.censoredData);
			if (result.matchState.status === 'last_chance')
					this.server.to(`room_${data.matchId}`).emit('last_chance_triggered');
			else if (result.matchState.status === 'game_over') {
				await this.multiplayerService.endMatch(data.matchId, result.matchState.winnerId, user.id);
				this.server.to(`room_${data.matchId}`).emit('game_over', {
					isDraw: result.matchState.isDraw,
					winnerId: result.matchState.winnerId,
					secretChampionName: result.matchState.secretChampionName
				});
				const sockets = await this.server.in(`room_${data.matchId}`).fetchSockets();
				for (const s of sockets) {
					s.data.currentMatchId = undefined;
				}
				this.server.in(`room_${data.matchId}`).socketsLeave(`room_${data.matchId}`);
			}
		}
		catch (error) {
			if (error instanceof Error) {
				console.error(`Erreur jeu pour ${client.data.user.username}:`, error.message);
				client.emit(`game_error`, { message: error.message});
			} else
				console.error(`Erreur inattendue :`, error);
		}
	}

	@SubscribeMessage('join_game_room')
	async handleJoinRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { matchId: string }
	) {
		const userId = client.data.user.id;
		const pendingReconnect = this.reconnectTimeouts.get(userId);

		if (pendingReconnect && pendingReconnect.matchId === data.matchId) {
			clearTimeout(pendingReconnect.timeout);
			this.reconnectTimeouts.delete(userId);

			client.join(`room_${data.matchId}`);
			client.data.currentMatchId = data.matchId;

			console.log(`Le joueur ${client.data.user.username} s'est reconnecté à la room ${data.matchId}`);
			this.server.to(`room_${data.matchId}`).emit('player_reconnected', {
				userId: userId,
				username: client.data.user.username
			});
			const matchState = await this.multiplayerService.getMatchState(data.matchId);
			const starterUserId = this.matchStarters.get(data.matchId);
			client.emit('match_state_restored', { matchState, starterUserId });
			return;
		}

		client.join(`room_${data.matchId}`);
		client.data.currentMatchId = data.matchId;
		console.log(`Le joueur ${client.data.user.username} a rejoint la room ${data.matchId}`);

		const room = this.server.adapter.rooms.get(`room_${data.matchId}`);
		if (room && room.size === 2) {
			const sockets = await this.server.in(`room_${data.matchId}`).fetchSockets();
			const userIds = sockets.map(s => s.data.user?.id).filter(Boolean);
			const starterUserId = userIds.length === 2 
				? userIds[Math.floor(Math.random() * userIds.length)]
				: (sockets[0]?.data?.user?.id || '');

			this.matchStarters.set(data.matchId, starterUserId);
			this.server.to(`room_${data.matchId}`).emit('game_ready', { starterUserId });
			console.log(`La partie ${data.matchId} commence ! Starter (UserId): ${starterUserId}`);
		}
	}
	
	@SubscribeMessage('join_matchmaking')
	async handleJoinMatchmaking(@ConnectedSocket() client: Socket) {
		const userId = client.data.user.id;

		if (this.matchmakingQueue.find(player => player.userId === userId)) {
			console.log(`[REFUSÉ] Le joueur ${client.data.user.username} est déjà dans la file !`);
			return;
		}
		this.matchmakingQueue.push({userId, socketId: client.id});
		client.emit('matchmaking_started');
		console.log(`[MATCHMAKING] ${client.data.user.username} a rejoint la file. Joueurs en attente : ${this.matchmakingQueue.length}`);
		if (this.matchmakingQueue.length >= 2) {
			console.log(`[MATCHMAKING] 2 joueurs trouvés ! Création du match...`);
			const player1 = this.matchmakingQueue.shift();
			const player2 = this.matchmakingQueue.shift();

			if (!player1 || !player2)
				return;
			const match = await this.multiplayerService.createMatch(player1.userId, player2.userId);
			this.server.to(player1.socketId).emit('match_found', { matchId: match.id });
        	this.server.to(player2.socketId).emit('match_found', { matchId: match.id });
		}
	}

	@SubscribeMessage('leave_matchmaking')
	async handleLeaveMatchmaking(@ConnectedSocket() client: Socket) {
		const userId = client.data.user.id;
		this.matchmakingQueue = this.matchmakingQueue.filter(player => player.userId !== userId);
		client.emit('matchmaking_cancelled');
	}
}
