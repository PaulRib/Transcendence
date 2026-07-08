import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get('messages/:userId')
    @UseGuards(JwtAuthGuard)
    getConversation(
        @Request() request,
        @Param('userId') userId: string,
    ) {
        return this.chatService.getConversation(
            request.user.sub,
            userId,
        );
    }
}