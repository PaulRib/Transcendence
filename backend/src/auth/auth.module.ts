import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

import { TwoFactorController } from './two-factor.controller';
import { TwoFactorService } from './two-factor.service';

@Module({
    imports: [UsersModule, JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: {
            expiresIn: '24h'
        },
    })],
    controllers: [AuthController, TwoFactorController],
    providers: [AuthService, TwoFactorService],
})
export class AuthModule {}
