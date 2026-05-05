import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { PublicUser } from './types/public-user.type';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService : UsersService) {}

    @Get('by-username/:username')
    getUserByUsername(
        @Param('username') username: string,
    ): PublicUser {
        return this.usersService.getUserByUsername(username);
    }

    @Get(':id')
        getUserById(@Param('id') id: string): PublicUser {
            return this.usersService.getUserById(id);
        }
}