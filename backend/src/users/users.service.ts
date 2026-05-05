import { Injectable, NotFoundException } from "@nestjs/common";
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

    getUserById(id: string): PublicUser {
        const foundUser = this.users.find((currentUser) => currentUser.id === id);
        
        if (!foundUser) {
            throw new NotFoundException(`User width id "${id}" not found`);
        }
        return foundUser;
    }

    getUserByUsername(username: string): PublicUser {
        const foundUser = this.users.find((currentUser) => currentUser.username === username);
        
        if(!foundUser){
            throw new NotFoundException(
                `User with username "${username}" not found`);
        }
        return foundUser;
    }
}