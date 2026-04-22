import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // mettre le prefix globale 'api' pour toutes les routes

  app.enableCors({
    origin: 'http://localhost:5173', // CORS autorise un port qui differe du back-end, donc en gros autorise le front end a appeler le back en
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
