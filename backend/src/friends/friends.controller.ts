import { UseGuards, Request, Controller, Post, Param, Get, Patch, Delete } from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { SocialEventsService } from "../social/social-events.service";

@Controller('friends')
export class FriendsController {
    constructor(
        private readonly friendsService: FriendsService,
        private readonly socialEventsService: SocialEventsService,
    ) {}

    @Post('requests/:userId')
    @UseGuards(JwtAuthGuard)
    async sendFriendRequest(
        @Request() request,
        @Param('userId') targetUserId: string,
    ) {
        const friendRequest = await this.friendsService.sendFriendRequest(request.user.sub, targetUserId);
        this.socialEventsService.emitFriendsChanged([request.user.sub, targetUserId]);
        return friendRequest;
    }

    @Get('requests')
    @UseGuards(JwtAuthGuard)
    getReceivedFriendRequests(@Request() request) {
        return this.friendsService.getReceivedFriendRequests(request.user.sub);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getFriends(@Request() request) {
        return this.friendsService.getFriends(request.user.sub);
    }

    @Patch('requests/:requestId/accept')
    @UseGuards(JwtAuthGuard)
    async acceptFriendRequest(
        @Request() request,
        @Param('requestId') requestId: string,
    ) {
        const friendship = await this.friendsService.acceptFriendRequest(request.user.sub, requestId);
        this.socialEventsService.emitFriendsChanged([
            friendship.requester_id,
            friendship.addressee_id,
        ]);
        return friendship;
    }

    @Delete(':friendshipId')
    @UseGuards(JwtAuthGuard)
    async deleteFriendship(
        @Request() request,
        @Param('friendshipId') friendshipId: string,
    ) {
        const friendship = await this.friendsService.deleteFriendship(request.user.sub, friendshipId);
        this.socialEventsService.emitFriendsChanged([
            friendship.requester_id,
            friendship.addressee_id,
        ]);
        return friendship;
    }

}
