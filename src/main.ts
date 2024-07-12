import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const mongourl=configService.get<string>('MONGO_URL');
  console.log(`server started on mongourl port ${mongourl}`);
  const rabbiturl=configService.get<string>('RABBITMQ_URL');
  console.log(`server started on rabbiturl port ${rabbiturl}`);
  await app.listen(3000);
}
bootstrap();
