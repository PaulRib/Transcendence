import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PublicUser } from './types/public-user.type'
import { randomBytes, scryptSync } from "crypto";

type UserForLogin = {
    id: string;
    username: string;
    avatar_url: string | null;
    password_hash: string | null;
};

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

    async createUser(username: string, email: string, password: string): Promise<PublicUser> {
        const salt = randomBytes(16).toString('hex');
        const passwordHash = scryptSync(password, salt, 64).toString('hex');

        const createdUser = await this.prisma.user.create({
            data: {
                username,
                email,
                password_hash: `${salt}:${passwordHash}`,
            },
            select: {
                id: true,
                username: true,
                avatar_url: true,
            },
        });
        return createdUser;
    }

    async userExistsByEmail(email: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
            },
        });
        if (user) {
            return true;
        }
        return false;
    }

    async userExistsByUsername(username: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
            },
        });
        if (user) {
            return true;
        }
        return false;
    }

    async findUserForLogin(identifier: string): Promise<UserForLogin | null> {
        return this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: identifier },
                    { email: identifier },
                ],
            },
            select: {
                id: true,
                username: true,
                avatar_url: true,
                password_hash: true,
            },
        });
    }
}