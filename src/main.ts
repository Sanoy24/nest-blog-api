import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Nestjs Blog API')
    .setDescription('This is personal nestjs project for blog api')
    .setVersion('1.0')
    .addTag('Blog')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(helmet());
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
