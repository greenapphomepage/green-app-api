import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './pipe/exceptionfilter.pipe';
import { unEscapeHTMLInterceptor } from './pipe/unescap_HTML_interceptor';
import { ValidationPipe } from './pipe/validation.pipe';
import { escapeHTMLpipe } from './pipe/escape_HTML_transform';
import {
  HttpException,
  HttpStatus,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { SendResponse } from './utils/send-response';
import config from './config/config';
import code from './config/code';
declare const module: any;

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    const err = null;
    try {
      const ipAddr =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
      console.log('-----------------------------------------------------');
      console.log(
        new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
      );

      console.log({ url: req.url });
      console.log({ body: req.body });
      console.log({ query: req.query });
      console.log({ ip: ipAddr });
      if (Object.keys(req.query).length > 0) {
        if (req.query['page']) {
          if (
            +req.query['page'] > 1000000 ||
            !req.query['page'].match(config.REGEX_NUBMER.value)
          )
            throw code.VALIDATION_ERROR.type;
        }
        if (req.query['perPage']) {
          if (
            +req.query['perPage'] > 100000 ||
            !req.query['perPage'].match(config.REGEX_NUBMER.value)
          )
            throw code.VALIDATION_ERROR.type;
        }
        if (req.query['sort']) {
          if (req.query['sort'])
            req.query['sort'] = req.query['sort'].toUpperCase();
        }
        if (!req.query['language']) {
          req.query['language'] = config.LOCALES.value.filter(
            (item) => item == 'vi',
          )[0];
        }
      }
    } catch (e) {
      console.log(e);
      throw new HttpException(SendResponse.error(e), HttpStatus.FORBIDDEN);
    }
    next();
  });

  app.use(async (req, res, next) => {
    const err = null;
    try {
      const { ip, method, originalUrl } = req;

      if (originalUrl.includes('/excel/')) {
        throw 'BLOCKING';
      }
    } catch (e) {
      return next(new NotFoundException(SendResponse.error(e)));
    }
    next();
  });
  if (process.env.NODE_ENV !== 'production') {
    const config_bearer = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Nest Example')
      .setDescription('Nest Example By Nguyen Cong Thang')
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
    });
  }

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new unEscapeHTMLInterceptor());
  app.useGlobalPipes(
    ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      // forbidUnknownValues: true,
      disableErrorMessages: true,
    }),
    new escapeHTMLpipe(),
  );

  await app.listen(process.env.LISTEN_PORT, process.env.LISTEN_IP);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  logger.log(`app running on port ${process.env.LISTEN_PORT}`);
}
bootstrap();
