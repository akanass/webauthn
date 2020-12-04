import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ServerConfig } from './interfaces/server-config.interface';
import * as Config from 'config';
import { join } from 'path';

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

  // set static assets
  app.useStaticAssets({
    root: join(__dirname, config.assets.rootPath),
    prefix: config.assets.prefix,
  });

  // set view engine
  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, config.views.templatesPath),
    layout: config.views.layout,
    includeViewExtension: true,
    options: {
      async: true,
      useHtmlMinifier: require('html-minifier'),
      htmlMinifierOptions: {
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeEmptyAttributes: true,
        minifyCSS: true,
        minifyJS: true,
      },
    },
    defaultContext: {
      title: config.views.title,
    }
  });

  // launch server
  await app.listen(config.port, config.host);
  Logger.log(`Application served at ${config.protocol}://${config.host}:${config.port}`, 'bootstrap');
}

bootstrap(Config.get<ServerConfig>('server'));
