import { UseGuards, Request , Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import type { PublicUser } from './types/public-user.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService : UsersService) {}

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@Request() request) {
        return this.usersService.getUserById(request.user.sub);
    }

    @Patch('me/password')
    @UseGuards(JwtAuthGuard)
    updateMyPassword(
        @Request() request,
        @Body() updatePasswordDto: UpdatePasswordDto,
    ) {
        return this.usersService.updatePassword(
            request.user.sub,
            updatePasswordDto,
        );
    }

    @Patch('me')
    @UseGuards(JwtAuthGuard)
    updateMe(
        @Request() request,
        @Body() updateProfileDto: UpdateProfileDto,
    ): Promise<PublicUser> {
        return this.usersService.updateProfile(
            request.user.sub,
            updateProfileDto,
        );
    }

    @Get('by-username/:username')
    getUserByUsername(
        @Param('username') username: string,
    ): Promise<PublicUser> {
        return this.usersService.getUserByUsername(username);
    }

    @Get(':id')
        getUserById(@Param('id') id: string): Promise<PublicUser> {
            return this.usersService.getUserById(id);
        }
}