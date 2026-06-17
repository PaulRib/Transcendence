import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { scryptSync } from "crypto";
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from "./dto/login.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

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

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findUserForLogin(loginDto.identifier);
        if (!user || !user.password_hash) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const [salt, storedHash] = user.password_hash.split(':');
        const passwordHash = scryptSync(loginDto.password, salt, 64).toString('hex');

        if (passwordHash !== storedHash) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, username: user.username};
        return {
            user: {
                id: user.id,
                username: user.username,
                avatar_url: user.avatar_url,
            },
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async getMe(userId: string){
        return this.usersService.getUserById(userId);
    }
}
