import { WebSocketGateway, WebSocketServer, OnGatewayConnection,
		 OnGatewayDisconnect, SubscribeMessage, ConnectedSocket, MessageBody
 } from '@nestjs/websockets';
 import { Socket, Namespace} from 'socket.io';
 import { JwtService } from '@nestjs/jwt';
 import { UsersService } from '../users/users.service';
 import { MultiplayerService } from './multiplayer.service'

 @WebSocketGateway({ cors: true, namespace: '/game'})
 export class MultiplayerGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server!: Namespace;

	private matchmakingQueue: Array<{userId: string, socketId: string }> = [];
	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly multiplayerService: MultiplayerService,
	) {}

	async handleConnection(client: Socket) {
		try {
			const token = client.handshake.auth.token;
			if (!token)
					throw new Error("No token provided");
			const payload = this.jwtService.verify(token, {secret : process.env.JWT_SECRET});
			const user = await this.usersService.getUserById(payload.sub);

			client.data.user = user;
			console.log(`Connexion reussie : ${user.username}, ${client.id}`);
		}
		catch (error) {
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
			try {
				const winnerId = await this.multiplayerService.forfeitMatch(matchId, user.id);
				if (winnerId) {
					this.server.to(`room_${matchId}`).emit('game_over', {
						isDraw: false,
						winnerId: winnerId,
						reason: 'opponent_disconnected'
					});
					this.server.in(`room_${matchId}`).socketsLeave(`room_${matchId}`);
				}
			}
			catch (error) {
				console.error(`Erreur lors du forfait de ${user.username}:`, error)
			}
		 }
	}

	@SubscribeMessage('submit_guess')
	async handle_guess(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { GuessedChamp: string, matchId: string }
	) {
		try {
			const user = client.data.user;

			const result = await this.multiplayerService.processPlayerTurn(
				data.matchId, user.id, data.GuessedChamp
			)
			client.emit('guess_result_full', result.fullData);
			client.to(`room_${data.matchId}`).emit('guess_result_spectator', result.censoredData);
			if (result.matchState.status === 'last_chance')
					this.server.to(`room_${data.matchId}`).emit('last_chance_triggered');
			else if (result.matchState.status === 'game_over') {
				this.server.to(`room_${data.matchId}`).emit('game_over', {
					isDraw: result.matchState.isDraw,
					winnerId: result.matchState.winnerId
				});
				await this.multiplayerService.endMatch(data.matchId, result.matchState.winnerId, user.id);
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
		client.join(`room_${data.matchId}`);
		client.data.currentMatchId = data.matchId;
		console.log(`Le joueur ${client.data.user.username} a rejoint la room ${data.matchId}`);

		const room = this.server.adapter.rooms.get(`room_${data.matchId}`)
		if (room && room.size === 2) {
			this.server.to(`room_${data.matchId}`).emit('game_ready');
			console.log(`La partie ${data.matchId} commence !`);
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