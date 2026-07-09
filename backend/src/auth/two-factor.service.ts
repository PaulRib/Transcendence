import { Injectable, UnauthorizedException } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TwoFactorService {
  constructor(private readonly prisma: PrismaService) {}

  
//    Generate a new TOTP secret for the user, store it in the database
//    without enabling 2FA yet, then return the QR Code as a Base64 DataURL.
   
  async generateTwoFactorSecret(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }
    if (user.is_two_factor_enabled) {                                                                                           
      throw new UnauthorizedException('La 2FA est déjà activée. Vous devez la désactiver avant d\'en générer une nouvelle.');   
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


   //Officially enable 2FA after verifying the first 6-digit code
   //scanned from Google Authenticator.
  async turnOnTwoFactor(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.two_factor_secret) {
      throw new UnauthorizedException('Secret 2FA non généré pour cet utilisateur');
    }

    // Cryptographic code verification
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
