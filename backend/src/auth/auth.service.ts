import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { scryptSync } from "crypto";
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from "./dto/login.dto";
import { UsersService } from "../users/users.service";

type FortyTwoUser = {
    id: number;
    login: string;
    email: string;
    image?: {
        link?: string;
    };
};


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

        if (user.is_two_factor_enabled) {
            return {
                requires2FA: true,
                userId: user.id,
            };
        }
        return this.generateJwtTokenForUser(user);
    }
    async generateJwtTokenForUser(user: any) {
        const payload = { sub: user.id, username: user.username };
        return {
            user: {
                id: user.id,
                username: user.username,
                avatar_url: user.avatar_url,
                elo_rating: user.elo_rating,
                ranked_wins: user.ranked_wins,
                ranked_losses: user.ranked_losses,
                is_two_factor_enabled: user.is_two_factor_enabled,
            },
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async getMe(userId: string){
        return this.usersService.getUserById(userId);
    }

    async loginWith42(code:string) {
        const tokenResponse = await fetch('https://api.intra.42.fr/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.FORTYTWO_CLIENT_ID,
                client_secret: process.env.FORTYTWO_CLIENT_SECRET,
                code,
                redirect_uri: process.env.FORTYTWO_CALLBACK_URL,
            }),
        });

        if (!tokenResponse.ok) {
            throw new UnauthorizedException('Invalid 42 authorization code');
        }

        const tokenData = await tokenResponse.json() as { access_token: string };

        const userResponse = await fetch('https://api.intra.42.fr/v2/me', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        if (!userResponse.ok) {
            throw new UnauthorizedException('Unable to fetch 42 user');
        }

        const fortyTwoUser = await userResponse.json() as FortyTwoUser;
        const oauthId = String(fortyTwoUser.id);

        let user = await this.usersService.findUserByOauth('42', oauthId);

        if (!user) {
            const existingUser = await this.usersService.findByEmail(fortyTwoUser.email);

            if (existingUser) {
                throw new UnauthorizedException(
                    'An account with this email already exists'
                );
            }

            user = await this.usersService.createOauthUser (
                fortyTwoUser.login,
                fortyTwoUser.email,
                fortyTwoUser.image?.link ?? null,
                '42',
                oauthId,
            );
        }

        if (user.is_two_factor_enabled) {
            return {
                requires2FA: true,
                userId: user.id,
            };
        }
        return this.generateJwtTokenForUser(user);
    }
}
