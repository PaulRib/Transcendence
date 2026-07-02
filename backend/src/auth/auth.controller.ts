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
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response ){
        const result = await this.authService.login(loginDto);

        response.cookie('access_token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });
        return { user: result.user }
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        return { message: 'Logged out sucessfully'};
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
        try {
            const loginResponse = await this.authService.loginWith42(code);

            response.cookie('access_token', loginResponse.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

            return response.redirect(`${process.env.FRONTEND_URL}/auth/42/callback?`);
        } catch {
            return response.redirect(`${process.env.FRONTEND_URL}/login?oauthError=email_exists`);
        }
    }
}
