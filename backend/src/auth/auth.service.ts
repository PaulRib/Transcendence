import { Injectable, ConflictException } from "@nestjs/common";
import { RegisterDto } from './dto/register.dto';
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    async register(registerDto: RegisterDto) {
        const usernameAlreadyExists = await this.usersService.userExistsByUsername(
            registerDto.username,
        );

        if (usernameAlreadyExists) {
            throw new ConflictException('Username already exists');
        }

        const emailAlreadyExists = await this.usersService.userExistsByEmail(
            registerDto.email,
        );

        if (emailAlreadyExists) {
            throw new ConflictException('Email already exists');
        }

        return this.usersService.createUser(
            registerDto.username,
            registerDto.email,
            registerDto.password,
        );
    }
}
