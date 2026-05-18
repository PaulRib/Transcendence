import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PublicUser } from './types/public-user.type'

@Injectable()
export class UsersService {
   constructor (private readonly prisma: PrismaService) {}

    async getUserById(id: string): Promise<PublicUser> {
        const foundUser = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                avatar_url: true,
            },
        });
        
        if (!foundUser) {
            throw new NotFoundException(`User with id "${id}" not found`);
        }
        return foundUser;
    }

    async getUserByUsername(username: string): Promise<PublicUser> {
        const foundUser = await this.prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                avatar_url: true,
            },
        });
        
        if(!foundUser){
            throw new NotFoundException(
                `User with username "${username}" not found`);
        }
        return foundUser;
    }
}