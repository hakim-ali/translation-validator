import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Translation Validator')
    .setDescription(
      'This API provides endpoints to validate translations and perform text translations between languages.',
    )
    .setVersion('1.0')
    .addTag(
      'translation-validate',
      'Endpoints for validating translation accuracy',
    )
    .addTag(
      'translation-translate',
      'Endpoints for translating text into a specified language',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
