import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  UnauthorizedException,
  HttpCode,
  Res,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TwoFactorService } from './two-factor.service';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import type { Response } from 'express';

@Controller('2fa')
export class TwoFactorController {
  constructor(
    private readonly twoFactorService: TwoFactorService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 1. Route pour générer le QR Code et le secret (nécessite d'être connecté via JWT).
   */
  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generate(@Request() req: any) {
    return this.twoFactorService.generateTwoFactorSecret(req.user.sub);
  }

  /**
   * 2. Route pour confirmer et activer définitivement la 2FA après avoir scanné le QR Code.
   */
  @Post('turn-on')
  @UseGuards(JwtAuthGuard)
  async turnOn(@Request() req: any, @Body() body: { code: string }) {
    if (!body.code) {
      throw new UnauthorizedException('Code 2FA requis');
    }
    return this.twoFactorService.turnOnTwoFactor(req.user.sub, body.code);
  }

  /**
   * 3. Route pour désactiver la 2FA (exige la saisie du code actuel pour raison de sécurité).
   */
  @Post('turn-off')
  @UseGuards(JwtAuthGuard)
  async turnOff(@Request() req: any, @Body() body: { code: string }) {
    if (!body.code) {
      throw new UnauthorizedException('Code 2FA requis pour désactiver la fonction');
    }
    return this.twoFactorService.turnOffTwoFactor(req.user.sub, body.code);
  }

  /**
   * 4. Route publique utilisée lors du Login pour finaliser la connexion après saisie du code 2FA.
   */
  @Post('authenticate')
  @HttpCode(200)
  async authenticate(
    @Body() body: { userId: string; code: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!body.userId || !body.code) {
      throw new UnauthorizedException('Paramètres manquants');
    }

    const isValid = await this.twoFactorService.verifyTwoFactorCode(body.userId, body.code);
    if (!isValid) {
      throw new UnauthorizedException('Code 2FA incorrect');
    }

    const user = await this.usersService.getUserById(body.userId);
    const tokenResult = await this.authService.generateJwtTokenForUser(user);

    response.cookie('access_token', tokenResult.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { user: tokenResult.user };
  }
}
