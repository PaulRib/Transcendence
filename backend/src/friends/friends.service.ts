import { BadRequestException, ConflictException, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
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

    async acceptFriendRequest(userId: string, requestId: string) {

        const friendship = await this.prisma.friendship.findUnique({
            where: { id: requestId },
        });
        
        if (!friendship) {
            throw new NotFoundException("Friend request not found");
        }

        if (friendship.addressee_id !== userId) {
            throw new ForbiddenException("You cannot accept this friend request");
        }

        if (friendship.status !== "pending") {
            throw new ConflictException("Friend request is not pending");
        }

        return this.prisma.friendship.update({
            where: { id: requestId },
            data: { status: "accepted" },
        });
    }

    async deleteFriendship(userId: string, friendshipId: string) {

        const friendship = await this.prisma.friendship.findUnique({
            where: { id: friendshipId },
        });

        if (!friendship) {
            throw new NotFoundException("Friendship not found");
        }

        if (friendship.requester_id !== userId && friendship.addressee_id !== userId) {
            throw new ForbiddenException("You cannot delete this friendship");
        }
        return this.prisma.friendship.delete({
            where: { id: friendshipId },
        });
    }

    async getFriends(userId: string) {
        return this.prisma.friendship.findMany({
            where: {
                status: "accepted",
                OR: [
                    { requester_id: userId },
                    { addressee_id: userId },
                ],
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        username: true,
                        avatar_url: true,
                    },
                },
                addressee: {
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
