import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ServerConfig } from './interfaces/server-config.interface';
import { ViewsConfig } from './interfaces/views-config.interface';
import { AssetsConfig } from './interfaces/assets-config.interface';
import { PipesConfig } from './interfaces/pipes-config.interface';
import { SwaggerConfig } from './interfaces/swagger-config.interface';
import { join } from 'path';
import * as helmet from 'fastify-helmet';
import * as secureSession from 'fastify-secure-session';
import * as Config from 'config';
import * as Handlebars from 'handlebars';
import * as HtmlMinifier from 'html-minifier-terser';
import * as metadata from './metadata.json';
import * as fs from 'fs-extra';
import { ApiModule } from './api/api.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SessionConfig } from './interfaces/security-config.interface';

const bootstrap = async (
  config: ServerConfig,
  views: ViewsConfig,
  assets: AssetsConfig,
  pipes: PipesConfig,
  swagger: SwaggerConfig,
  session: SessionConfig,
) => {
  // create NestJS application
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(
      Object.assign(
        {},
        config.options
          .filter((_) => !(!config.runInHTTPS && _.name === 'https'))
          .reduce(
            (options, curr) =>
              Object.assign(options, {
                [curr.name]:
                  curr.name === 'https'
                    ? Object.keys(curr.value).reduce(
                        (opt, optKey) =>
                          Object.assign(opt, {
                            [optKey]: !!curr.value[optKey].path
                              ? fs.readFileSync(
                                  join(__dirname, curr.value[optKey].path),
                                )
                              : curr.value[optKey],
                          }),
                        {},
                      )
                    : curr.value,
              }),
            {},
          ),
      ),
    ),
  );

  // register helmet security plugin when SSL is enabled
  if (!!config.isSSL) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await app.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [
            `'self'`,
            `https: 'unsafe-inline'`,
            'data: fonts.googleapis.com',
          ],
          fontSrc: [`'self'`, 'https: fonts.googleapis.com'],
          imgSrc: [`'self'`, 'data: validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    });
  }

  // register secure session plugin
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await app.register(secureSession, session);

  // register all plugins
  await app
    // use global pipe validation
    .useGlobalPipes(new ValidationPipe(Object.assign({}, pipes.validation)))
    // set static assets
    .useStaticAssets(
      Object.assign({}, assets.options, {
        root: join(__dirname, assets.rootPath),
      }),
    )
    // set view engine
    .setViewEngine({
      engine: {
        handlebars: Handlebars,
      },
      templates: join(__dirname, views.templatesPath),
      layout: views.layout,
      includeViewExtension: views.includeViewExtension,
      options: Object.assign({}, views.engineOptions, {
        useHtmlMinifier: HtmlMinifier,
      }),
      defaultContext: Object.assign({}, views.defaultContext, {
        import: metadata.system.import,
        style: metadata.style,
      }),
      production: process.env.NODE_ENV === 'production',
    });

  // create swagger options
  const options = new DocumentBuilder()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .setVersion(swagger.version)
    .addTag(swagger.tag)
    .addCookieAuth(session.cookieName)
    .build();

  // create swagger document
  const apiDocument = SwaggerModule.createDocument(app, options, {
    include: [ApiModule],
  });

  // setup swagger module
  SwaggerModule.setup(swagger.path, app, apiDocument);

  // launch server
  await app.listen(config.port, config.host);
  Logger.log(
    `Application served at ${
      !!config.runInHTTPS ? config.protocol.secure : config.protocol.normal
    }://${config.host}:${config.port}`,
    'bootstrap',
  );
};

bootstrap(
  Config.get<ServerConfig>('server'),
  Config.get<ViewsConfig>('views'),
  Config.get<AssetsConfig>('assets'),
  Config.get<PipesConfig>('pipes'),
  Config.get<SwaggerConfig>('swagger'),
  Config.get<SessionConfig>('security.session'),
);
