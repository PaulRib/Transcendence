import { Injectable, UnauthorizedException } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TwoFactorService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. Génère un nouveau secret TOTP pour l'utilisateur, l'enregistre en base
   * (sans encore activer 2FA) et retourne le QR Code en Base64 (DataURL).
   */
  async generateTwoFactorSecret(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    // Génération du secret TOTP unique
    const secret = authenticator.generateSecret();

    // Construction de l'URL standardisée compatible Google Authenticator
    const otpauthUrl = authenticator.keyuri(user.email, 'FT_Transcendence', secret);

    // Stockage temporaire du secret en base de données
    await this.prisma.user.update({
      where: { id: userId },
      data: { two_factor_secret: secret },
    });

    // Génération de l'image QR Code au format Base64 Data URL
    const qrCodeDataUrl = await toDataURL(otpauthUrl);
    return { qrCodeDataUrl, secret };
  }

  /**
   * 2. Active officiellement la 2FA après vérification du premier code à 6 chiffres
   * scanné depuis Google Authenticator.
   */
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

    // Activation officielle dans la base de données
    await this.prisma.user.update({
      where: { id: userId },
      data: { is_two_factor_enabled: true },
    });

    return { message: 'Authentification à double facteur activée avec succès !' };
  }

  /**
   * 3. Désactive la 2FA et supprime le secret en base.
   */
  async turnOffTwoFactor(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.two_factor_secret) {
      throw new UnauthorizedException('La 2FA nest pas active');
    }

    // On exige le code 2FA actuel pour pouvoir le désactiver en toute sécurité
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

  /**
   * 4. Vérifie un code 2FA lors de la connexion (Login).
   */
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
