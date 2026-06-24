import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) {}

    async sendMessage(senderId: string, receiverId: string, content: string) {
        if (senderId == receiverId) {
            throw new BadRequestException("You cannot send a message to yourself");
        }

        const receiver = await this.prisma.user.findUnique({
            where: {id: receiverId},
        })
    }
}