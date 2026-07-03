import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api'); // mettre le prefix globale 'api' pour toutes les routes

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'https://localhost',
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
