import { UseGuards, Request, Controller, Post, Param, Get, Patch, Delete } from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}

    @Post('requests/:userId')
    @UseGuards(JwtAuthGuard)
    sendFriendRequest(
        @Request() request,
        @Param('userId') targetUserId: string,
    ) {
        return this.friendsService.sendFriendRequest(request.user.sub, targetUserId);
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
    acceptFriendRequest(
        @Request() request,
        @Param('requestId') requestId: string,
    ) {
        return this.friendsService.acceptFriendRequest(request.user.sub, requestId);
    }

    @Delete(':friendshipId')
    @UseGuards(JwtAuthGuard)
    deleteFriendship(
        @Request() request,
        @Param('friendshipId') friendshipId: string,
    ) {
        return this.friendsService.deleteFriendship(request.user.sub, friendshipId);
    }

}