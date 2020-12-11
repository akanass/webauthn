import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ServerConfig } from './interfaces/server-config.interface';
import { ViewsConfig } from './interfaces/views-config.interface';
import { AssetsConfig } from './interfaces/assets-config.interface';
import { PipesConfig } from './interfaces/pipes-config.interface';
import { join } from 'path';
import * as helmet from 'fastify-helmet';
import * as Config from 'config';
import * as Handlebars from 'handlebars';
import * as HtmlMinifier from 'html-minifier-terser';
import * as metadata from './metadata.json';
import * as fs from 'fs-extra';

async function bootstrap(config: ServerConfig, views: ViewsConfig, assets: AssetsConfig, pipes: PipesConfig) {
  // create NestJS application
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(
      Object.assign(
        {},
        config.options
          .filter(_ => !(!config.isSSL && _.name === 'https'))
          .reduce((options, curr) =>
            Object.assign(
              options,
              {
                [ curr.name ]: (
                  curr.name === 'https' ?
                    Object.keys(curr.value)
                      .reduce((opt, optKey) =>
                        Object.assign(
                          opt,
                          {
                            [ optKey ]:
                              !!curr.value[ optKey ].path ?
                                fs.readFileSync(join(__dirname, curr.value[ optKey ].path)) :
                                curr.value[ optKey ],
                          },
                        ), {}) :
                    curr.value
                ),
              },
            ), {}),
      ),
    ),
  );

  // register helmet security plugin when SSL is enabled
  if (!!config.isSSL) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await app.register(helmet);
  }

  // register all plugins
  app
    // use global pipe validation
    .useGlobalPipes(
      new ValidationPipe(Object.assign({}, pipes.validation)),
    )
    // set static assets
    .useStaticAssets(Object.assign({}, assets.options, {
      root: join(__dirname, assets.rootPath),
    }))
    // set view engine
    .setViewEngine({
      engine: {
        handlebars: Handlebars,
      },
      templates: join(__dirname, views.templatesPath),
      layout: views.layout,
      includeViewExtension: views.includeViewExtension,
      options: Object.assign({}, views.engineOptions, { useHtmlMinifier: HtmlMinifier }),
      defaultContext: Object.assign({}, views.defaultContext, { vendor: metadata.vendor, style: metadata.style }),
      production: process.env.NODE_ENV === 'production',
    });

  // launch server
  await app.listen(config.port, config.host);
  Logger.log(`Application served at ${!!config.isSSL ? config.protocol.secure : config.protocol.normal}://${config.host}:${config.port}`, 'bootstrap');
}

bootstrap(
  Config.get<ServerConfig>('server'),
  Config.get<ViewsConfig>('views'),
  Config.get<AssetsConfig>('assets'),
  Config.get<PipesConfig>('pipes'),
);
