import { Body, Controller, Param, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post('messages/:receiverId')
    @UseGuards(JwtAuthGuard)
    sendMessage(
        @Request() request,
        @Param('receiverId') receiverId: string,
        @Body() createMessageDto: CreateMessageDto,
    ) {
        return this.chatService.sendMessage(
            request.user.sub,
            receiverId,
            createMessageDto.content,
        );
    }
}