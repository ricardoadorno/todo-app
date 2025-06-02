import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Add your frontend URLs
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('Routine Flow API')
    .setDescription('The Routine Flow API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('tasks')
    .addTag('habits')
    .addTag('goals')
    .addTag('finances')
    .addTag('health')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Export OpenAPI JSON file if requested via environment variable
  if (process.env.EXPORT_OPENAPI_SPEC === 'true') {
    const outputPath = process.env.OPENAPI_PATH
      ? path.resolve(process.cwd(), process.env.OPENAPI_PATH)
      : path.resolve(process.cwd(), 'openapi-spec.json');

    // Create directory if it doesn't exist
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
    console.log(`OpenAPI specification exported to ${outputPath}`);
    process.exit(0);
  }

  // Setup Swagger UI endpoint
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(
    `🚀 Routine Flow API is running on: http://localhost:${port}/api`,
  );
  console.log(
    `📚 Swagger documentation available at: http://localhost:${port}/docs`,
  );
}
bootstrap();
