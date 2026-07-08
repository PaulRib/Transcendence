import {
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Request,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import type { PublicUser } from './types/public-user.type';

@Controller('users')
export class AvatarController {
    constructor(private readonly usersService: UsersService) {}

    @Post('me/avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const uploadPath = join(process.cwd(), 'uploads', 'avatars');
                    if (!existsSync(uploadPath)) {
                        mkdirSync(uploadPath, { recursive: true });
                    }
                    cb(null, uploadPath);
                },
                filename: (req: any, file, cb) => {
                    const userId = req.user?.sub || 'user';
                    const randomName = Array(8)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    cb(null, `${userId}-${randomName}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                    return cb(new BadRequestException('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB limit
            },
        }),
    )
    async uploadAvatar(
        @Request() request,
        @UploadedFile() file: any,
    ): Promise<PublicUser> {
        if (!file) {
            throw new BadRequestException('File is required');
        }

        // Publicly accessible path
        const avatarUrl = `/uploads/avatars/${file.filename}`;

        return this.usersService.updateProfile(request.user.sub, {
            avatar_url: avatarUrl,
        });
    }
}
