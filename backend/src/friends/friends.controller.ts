import { UseGuards, Request, Controller, Post, Param, Get } from "@nestjs/common";
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

}