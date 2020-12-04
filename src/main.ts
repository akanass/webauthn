import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ServerConfig } from './interfaces/server-config.interface';
import * as Config from 'config';

async function bootstrap(config: ServerConfig) {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  // use global pipe validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // launch server
  await app.listen(config.port, config.host);
  Logger.log(`Application served at ${config.protocol}://${config.host}:${config.port}`, 'bootstrap');
}

bootstrap(Config.get<ServerConfig>('server'));
