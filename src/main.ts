import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  const corsOrigins = configService.getOrThrow<string>('CORS_ORIGIN')
  
  app.enableCors({ origin: corsOrigins });
  
  const apiPort = configService.getOrThrow<number>('PORT');
  const apiUrl = configService.getOrThrow<string>('API_URL');

  await app.listen(apiPort, () => {
    console.log(`\nServer is running on: ${apiUrl}.`);
  });
}
bootstrap();
