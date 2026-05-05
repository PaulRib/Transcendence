import { Injectable } from "@nestjs/common";
import { PublicUser } from './types/public-user.type'

@Injectable()
export class UsersService {
    private readonly users: PublicUser[] = [
        {
            id: '1',
            username: 'mehdi',
            avatar_url: null,
        },
        {
            id: '2',
            username: 'paul',
            avatar_url: null,
        },
    ];

    getUserById(id: string): PublicUser | null {
        const foundUser = this.users.find((currentUser) => currentUser.id === id);
        return foundUser ?? null;
    }

    getUserByUsername(username: string): PublicUser | null {
        const foundUser = this.users.find((currentUser) => currentUser.username === username);
        return foundUser ?? null;
    }
}