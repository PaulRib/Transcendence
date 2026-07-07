import { Injectable, UnauthorizedException } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TwoFactorService {
  constructor(private readonly prisma: PrismaService) {}

  
//    Génère un nouveau secret TOTP pour l'utilisateur, l'enregistre en base
//    (sans encore activer 2FA) et retourne le QR Code en Base64 (DataURL).
   
  async generateTwoFactorSecret(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(user.email, 'FT_Transcendence', secret);
    await this.prisma.user.update({
      where: { id: userId },
      data: { two_factor_secret: secret },
    });
    const qrCodeDataUrl = await toDataURL(otpauthUrl);
    return { qrCodeDataUrl, secret };
  }


   //Active officiellement la 2FA après vérification du premier code à 6 chiffres
   //scanné depuis Google Authenticator.
  async turnOnTwoFactor(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.two_factor_secret) {
      throw new UnauthorizedException('Secret 2FA non généré pour cet utilisateur');
    }

    // Vérification cryptographique du code
    const isCodeValid = authenticator.verify({
      token: code,
      secret: user.two_factor_secret,
    });

    if (!isCodeValid) {
      throw new UnauthorizedException('Code 2FA invalide');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { is_two_factor_enabled: true },
    });

    return { message: 'Authentification à double facteur activée avec succès !' };
  }

  async turnOffTwoFactor(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.two_factor_secret) {
      throw new UnauthorizedException('La 2FA nest pas active');
    }

    const isCodeValid = authenticator.verify({
      token: code,
      secret: user.two_factor_secret,
    });

    if (!isCodeValid) {
      throw new UnauthorizedException('Code 2FA invalide');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        is_two_factor_enabled: false,
        two_factor_secret: null,
      },
    });

    return { message: 'Authentification à double facteur désactivée' };
  }

  async verifyTwoFactorCode(userId: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.two_factor_secret || !user.is_two_factor_enabled) {
      return false;
    }

    return authenticator.verify({
      token: code,
      secret: user.two_factor_secret,
    });
  }
}
