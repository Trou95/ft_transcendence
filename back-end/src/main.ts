import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as dotenv } from 'dotenv';
dotenv({ path: `.env` });
import config from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:4242'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
