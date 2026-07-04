import { BadRequestException, ForbiddenException, Injectable, NotFoundException, OnModuleInit, PreconditionFailedException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as toxicity from '@tensorflow-models/toxicity';

//OnModuleInit -> after initialize chat service, nestjs search if service has OnModuleInit, if it does, NestJS execute it one time at the start
@Injectable()
export class ChatService implements OnModuleInit {
	private toxicityModel: any;
    constructor(private readonly prisma: PrismaService) {}

	async onModuleInit() {
		const threshold = 0.85;

		const categoriesToLoad = ['toxicity', 'insult', 'threat'];

		this.toxicityModel = await toxicity.load(threshold, categoriesToLoad);
		console.log('IA Moderation launched and ready to work !')
	}

	private async automaticModeration(content: string): Promise<boolean> {
		if (!this.toxicityModel) {
			return false;
		}

		const predictions = await this.toxicityModel.classify([content]);

		return predictions.some((prediction: any) => prediction.results[0].match === true);
	}

    async sendMessage(senderId: string, receiverId: string, content: string) {
        if (senderId === receiverId) {
            throw new BadRequestException("You cannot send a message to yourself");
        }

        const receiver = await this.prisma.user.findUnique({
            where: { id: receiverId },
            select: { id: true },
        });

        if (!receiver) {
            throw new NotFoundException("User not found");
        }

        const blockedFriendship = await this.prisma.friendship.findFirst({
            where: {
                status: "blocked",
                OR: [
                    { requester_id: senderId, addressee_id: receiverId },
                    { requester_id: receiverId, addressee_id: senderId },
                ],
            },
            select: { id: true },
        });

        if (blockedFriendship) {
            throw new ForbiddenException("You cannot message this user");
        }
        
        const friendship = await this.prisma.friendship.findFirst({
            where: {
                status: "accepted",
                OR: [
                    { requester_id: senderId, addressee_id: receiverId },
                    { requester_id: receiverId, addressee_id: senderId },
                ],
            },
            select: { id: true },
        });

        if (!friendship) {
            throw new ForbiddenException("You can only message your friends");
        }

		const isToxic = await this.automaticModeration(content);
		if (isToxic) {
			throw new BadRequestException("Your message has been blocked by the moderation.");
		}

        return this.prisma.message.create({
            data: {
                sender_id: senderId,
                receiver_id: receiverId,
                content,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        avatar_url: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        username: true,
                        avatar_url: true,
                    },
                },
            },
        });
    }

    async getConversation(currentUserId: string, otherUserId: string) {
        if (currentUserId === otherUserId) {
            throw new BadRequestException("You cannot get a conversation with yourself");
        }

        const otherUser = await this.prisma.user.findUnique({
            where: { id: otherUserId },
            select: { id: true },
        });

        if (!otherUser) {
            throw new NotFoundException("User not found");
        }

        const friendship = await this.prisma.friendship.findFirst({
            where: {
                status: "accepted",
                OR: [
                    { requester_id: currentUserId, addressee_id: otherUserId },
                    { requester_id: otherUserId, addressee_id: currentUserId },
                ],
            },
            select: { id: true },
        });

        if (!friendship) {
            throw new ForbiddenException("You can only read conversations with your friends");
        }

        return this.prisma.message.findMany({
            where: {
                OR: [
                    { sender_id: currentUserId, receiver_id: otherUserId },
                    { sender_id: otherUserId, receiver_id: currentUserId },
                ],
            },
            orderBy: {
                created_at: 'asc',
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        avatar_url: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        username: true,
                        avatar_url: true,
                    },
                },
            },
        });
    }

    async markConversationAsRead(currentUserId: string, otherUserId: string) {
        const readAt = new Date();

        await this.prisma.message.updateMany({
            where: {
                sender_id: otherUserId,
                receiver_id: currentUserId,
                read_at: null,
            },
            data: {
                read_at: readAt,
            },
        });

        return { read_at: readAt };
    }
}
