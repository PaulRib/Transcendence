import { UseGuards, Request, Get, Body, Controller, HttpCode, Post, Query, Res } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import type { Response } from "express";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(200)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@Request() request) {
        return this.authService.getMe(request.user.sub);
    }

    @Get('42')
    loginWith42(@Res() response: Response) {
        const params = new URLSearchParams({
            client_id: process.env.FORTYTWO_CLIENT_ID ?? '',
            redirect_uri: process.env.FORTYTWO_CALLBACK_URL ?? '',
            response_type: 'code',
            scope: 'public',
        });

        return response.redirect(`https://api.intra.42.fr/oauth/authorize?${params.toString()}`);
    }

    @Get('42/callback')
    async callback42(@Query('code') code: string, @Res() response: Response) {
        const loginResponse = await this.authService.loginWith42(code);

        const params = new URLSearchParams({
            token: loginResponse.access_token,
            userId: loginResponse.user.id,
            username: loginResponse.user.username,
            avatarUrl: loginResponse.user.avatar_url ?? '',
        });

        return response.redirect(`${process.env.FRONTEND_URL}/auth/42/callback?${params.toString()}`);
    }
}
