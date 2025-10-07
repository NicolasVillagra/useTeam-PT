import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:5678',
        'http://localhost:5173',
        
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
  

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
