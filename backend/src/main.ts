import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api'); // mettre le prefix globale 'api' pour toutes les routes

  app.enableCors({
    origin: 'https://localhost', // CORS autorise un port qui differe du back-end, donc en gros autorise le front end a appeler le back end
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
