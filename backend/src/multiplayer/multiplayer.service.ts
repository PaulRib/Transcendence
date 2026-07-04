import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChampionsService } from '../champions/champions.service';
import { InfinitematchesService } from '../infinitematches/infinitematches.service';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class MultiplayerService {
    constructor(
		private readonly prisma: PrismaService,
		private championsService: ChampionsService,
		private inifinitematchesservice: InfinitematchesService,
		private readonly gamificationService: GamificationService,
	) {}

    async createMatch(player1Id: string, player2Id: string) {
		const targetChampionId = await this.inifinitematchesservice.getRandomChamp();

        return this.prisma.match.create({
            data: {
                game_mode: 'multiplayer',
                target_champion_id: targetChampionId,
                participants: {
                    create: [
                        { user_id: player1Id },
                        { user_id: player2Id },
                    ],
                },
            },
            include: {
                participants: true,
            }
        });
    }

	async endMatch(matchId: string, winnerId: string, userId: string) {
		const isDraw = winnerId === 'none';
		const finalizedMatch = await this.prisma.match.updateMany({
			where: { id: matchId, status: 'ongoing' },
			data: { status: "finished" }
		});

		if (finalizedMatch.count === 0)
			return;

		if (isDraw) {
			await this.prisma.match_Participant.updateMany({
				where: { match_id: matchId },
				data: { result: "draw", score: 1 }
			});
		} else {
			const loser = await this.prisma.match_Participant.findFirst({
				where: { match_id: matchId, user_id: { not: winnerId } },
				select: { user_id: true },
			});

			await this.prisma.match_Participant.updateMany({
				where: { match_id: matchId, user_id: winnerId },
				data: { result: "win", score: 3 }
			});
			await this.prisma.match_Participant.updateMany({
				where: { match_id: matchId, user_id: { not: winnerId } },
				data: { result: "loose", score: 0 }
			});

			if (loser) {
				await this.gamificationService.updateRankedElo(winnerId, loser.user_id);
			}
		}
	}

    async saveGuess(matchId: string, userId: string, championId: string, result: any, attempt: number) {
		const participant = await this.prisma.match_Participant.findFirst({ 
			where: {
				match_id: matchId,
				user_id: userId,
			}
		});

		if (!participant) 
			throw new Error("Participant introuvable pour ce match");

		const champion = await this.prisma.champion.findFirst({
			where: {
				id: championId,
			}
		})

		if (!champion) 
			throw new Error("Champion introuvable pour ce match");

		const newguess = await this.prisma.guess.create({
            data: {
                attempt_number: attempt,
                comparison_result: result,
                match_id: matchId,
				is_correct: result.isWin,
                participant_id: participant.id,
                champion_id: champion.id,
            }
        });

		return newguess;
    }

	async processPlayerTurn(matchId: string, userId: string, guessedChampion: string, starterUserId: string) {
		const match = await this.prisma.match.findUnique({
			where: {
				id: matchId,
			}
		});
		if (!match ) 
			throw new Error("Impossible de trouver le match");
		if (match.status !== 'ongoing')
    		throw new Error("Ce match est déjà terminé !");
		const secretChamp = await this.championsService.getExactChampById(match.target_champion_id);
		if (!secretChamp) 
			throw new Error("Impossible de trouver le champion");
		const guessedChamp = await this.championsService.getExactChampByName(guessedChampion);
		if (!guessedChamp) 
			throw new Error("Impossible de trouver le champion guess");


		const existingGuesses = await this.prisma.guess.count({
			where: {
				match_id: matchId,
				participant: {
					user_id: userId,
				},
			}
		});
		const attempt_number = existingGuesses + 1;
		const opponentAttempts = await this.prisma.guess.count({
			where: {
				match_id: matchId,
				participant: {user_id: { not: userId } }
			}
		});

		let isPlayerTurn = false;
		if (existingGuesses < opponentAttempts) 
    		isPlayerTurn = true;
		else if (existingGuesses === opponentAttempts) 
			isPlayerTurn = (userId === starterUserId);
		if (!isPlayerTurn)
			throw new Error("Triche détectée : Ce n'est pas ton tour !")
		const comparisonResult = await this.inifinitematchesservice.verifyInfiniteGuess(guessedChamp.name, secretChamp.id);
		await this.saveGuess(matchId, userId, guessedChamp.id, comparisonResult, attempt_number);

		const opponentLastGuess = await this.prisma.guess.findFirst({
			where: {
				match_id : matchId,
				participant: {user_id: { not: userId } },
			},
			orderBy: {
				attempt_number: 'desc'
			},
			include: {
				participant: true
			}
		});
		let matchStatus = 'ongoing';
		let isDraw = false;
		let finalWinnerId = 'none';
		if (comparisonResult.isWin) {
			if (attempt_number > opponentAttempts) {
				matchStatus = 'last_chance';
			}
			else {
				matchStatus = 'game_over';
				if (opponentLastGuess?.is_correct)
					isDraw = true;
				else
					finalWinnerId = userId;
			}
		}
		else {

		if (opponentLastGuess && opponentLastGuess.is_correct) {
			matchStatus = 'game_over';
			finalWinnerId = opponentLastGuess.participant.user_id;
			}
		}
		const isLastChance = matchStatus === 'last_chance';
		return {
			fullData: comparisonResult,
			censoredData: { name: isLastChance? null : guessedChamp.name },
			matchState: {
				status: matchStatus,
				isDraw: isDraw,
				winnerId: finalWinnerId,
				secretChampionName: matchStatus === 'game_over' ? secretChamp.name : undefined
			}
		}
	}

	async forfeitMatch(matchId: string, disconnectedUserId: string) {
		const match = await this.prisma.match.findUnique({where: { id: matchId } });
		if (!match || match.status !== 'ongoing') 
			return null;
		
		const remainingParticipant = await this.prisma.match_Participant.findFirst({
			where: { 
				match_id: matchId,
				user_id: { not : disconnectedUserId }
			}
		});
		
		if (!remainingParticipant)
			return null;

		const winnerId = remainingParticipant.user_id;
		await this.endMatch(matchId, winnerId, disconnectedUserId);

		return winnerId;
	}

	//a voir
	async getMatchHistory(userId: string) {
		return this.prisma.match_Participant.findMany({
			where: {
				user_id: userId,
				match: {
					status: "finished",
				},
			},
			select: {
				id: true,
				result: true,
				score: true,
				match: {
					select: {
						id: true,
						game_mode: true,
						played_at: true,
						participants: {
							select: {
								result: true,
								score: true,
								user: {
									select: {
										id: true,
										username: true,
										avatar_url: true,
									},
								},
							},
						},
					},
				},
			},
			orderBy: {
				match: {
					played_at: "desc",
				},
			},
		});
	}
	async getActiveMatchForUser(userId: string) {
        return this.prisma.match.findFirst({
            where: {
                status: 'ongoing',
                participants: {
                    some: { user_id: userId }
                }
            },
            include: {
                guesses: {
                    orderBy: { attempt_number: 'asc' },
                    include: {
                        champion: true,
                        participant: true
                    }
                },
                participants: {
                    include: {
                        user: true
                    }
                }
            }
        });
    }
	async getMatchState(matchId: string) {
        return this.prisma.match.findUnique({
            where: { id: matchId },
            include: {
                guesses: {
                    orderBy: { attempt_number: 'asc' },
                    include: {
                        champion: true,
                        participant: true
                    }
                },
                participants: {
                    include: {
                        user: true
                    }
                }
            }
        });
    }
}
