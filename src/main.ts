import * as compression from 'compression';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './pipe/exceptionfilter.pipe';
import { unEscapeHTMLInterceptor } from './pipe/unescap_HTML_interceptor';
import { ValidationPipe } from './pipe/validation.pipe';
import { escapeHTMLpipe } from './pipe/escape_HTML_transform';
// import * as fs from 'fs';
// import * as path from 'path';
import { Logger, VersioningType } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.use((req, res, next) => {
  //   const err = null;
  //   try {
  //     if (Object.keys(req.query).length > 0) {
  //       if (req.query['page']) {
  //         if (
  //           +req.query['page'] > 1000000 ||
  //           !req.query['page'].match(config.REGEX_NUBMER.value)
  //         )
  //           throw code.VALIDATION_ERROR.type;
  //       }
  //       if (req.query['perPage']) {
  //         if (
  //           +req.query['perPage'] > 100000 ||
  //           !req.query['perPage'].match(config.REGEX_NUBMER.value)
  //         )
  //           throw code.VALIDATION_ERROR.type;
  //       }
  //       if (req.query['sort']) {
  //         if (req.query['sort'])
  //           req.query['sort'] = req.query['sort'].toUpperCase();
  //       }
  //       if (!req.query['language']) {
  //         req.query['language'] = config.LOCALES.value.filter(
  //           (item) => item == 'vi',
  //         )[0];
  //       }
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     throw new HttpException(SendResponse.error(e), HttpStatus.FORBIDDEN);
  //   }
  //   next();
  // });

  // app.use(async (req, res, next) => {
  //   const err = null;
  //   try {
  //     const { ip, method, originalUrl } = req;

  //     if (originalUrl.includes('/excel/')) {
  //       throw 'BLOCKING';
  //     }
  //   } catch (e) {
  //     return next(new NotFoundException(SendResponse.error(e)));
  //   }
  //   next();
  // });

  app.use(compression());
  app.use(json({ limit: '10mb' }));
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new unEscapeHTMLInterceptor());
  app.useGlobalPipes(
    ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      // forbidUnknownValues: true,
      disableErrorMessages: true,
      transform: true,
    }),
    new escapeHTMLpipe(),
  );
  if (process.env.NODE_ENV !== 'production') {
    const config_bearer = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Green App Api')
      .setDescription('Green App Api Document')
      .setVersion('1.0.1')
      .build();
    const document = SwaggerModule.createDocument(app, config_bearer);

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        tagsSorter: 'alpha',
        operationsSorter: 'method',
        docExpansion: 'none',
        persistAuthorization: true,
      },
      customSiteTitle: 'Green App Api',
      // customCss: fs.readFileSync(
      //   path.join(__dirname, '..', 'assets', 'swagger-custom.css'),
      //   'utf8',
      // ),
      customfavIcon:
        'data:image/png;base64,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',
    });
  }

  await app.listen(process.env.LISTEN_PORT, process.env.LISTEN_IP, () => {
    logger.log(
      `Server document API APP running on http://localhost:${process.env.LISTEN_PORT}/docs`,
      'Bootstrap',
    );
  });
}
bootstrap();
