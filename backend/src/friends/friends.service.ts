import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class FriendsService {
    constructor(private readonly prisma: PrismaService) {}

   async sendFriendRequest(requesterId: string, targetUserId: string) {

        if (requesterId === targetUserId) {
            throw new BadRequestException("You cannot add yourself as a friend");
        }

        const targetUser = await this.prisma.user.findUnique({
            where: { id: targetUserId },
            select: { id: true },
        });

        if (!targetUser) {
            throw new NotFoundException("User not found");
        }

        const existingFriendship = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    { requester_id: requesterId, addressee_id: targetUserId },
                    { requester_id: targetUserId, addressee_id: requesterId },
                ],
            },
        });

        if(existingFriendship) {
            throw new ConflictException("Friend request already exist");
        }

        return this.prisma.friendship.create ({
            data: {
                requester_id: requesterId,
                addressee_id: targetUserId,
                status: "pending",
            },
        });
    }

    async getReceivedFriendRequests(userId: string) {
        return this.prisma.friendship.findMany({
            where: { 
                addressee_id: userId,
                status: "pending",
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        username: true,
                        avatar_url: true,
                    },
                },
            },
        });
    }
}