import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { SystemModule } from './modules/system/system.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { OrderProjectModule } from './modules/order-project/order-project.module';
import { FileManagerService } from './utils/file-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { FeatureModule } from './modules/feature/feature.module';
import { PreviewModule } from './modules/preview/preview.module';
import { SeedModule } from './modules/seed/seed.module';
import { ScreenModule } from './modules/screen/screen.module';
import { EstimateModule } from './modules/estimate/estimate.module';
import { TagModule } from './modules/tag/tag.module';
import { LoggerModule } from './modules/logger/logger.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { LoggerService } from './modules/logger/logger.service';
import { TypeModule } from './modules/type/type.module';
import { MailService } from './utils/mail';
import * as process from 'process';
import { AboutModule } from './modules/about/about.module';
import { BlogModule } from './modules/blog/blog.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MailerModule.forRoot({
      transport: {
        // service: process.env.MAIL_SERVICE,
        host: process.env.MAIL_HOST,
        port: +process.env.MAIL_PORT,
        secure: false,
        // ignoreTLS: true,
        // tls: {
        //   minDHSize: 512,
        //   minVersion: 'TLSv1',
        //   maxVersion: 'TLSv1.3',
        //   ciphers: 'ALL',
        // },
        // debug: true, // show debug output
        // logger: true,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <gm4-korea@greenapps.kr> ',
      },
      template: {
        dir: join(__dirname, 'mail', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UserModule,
    AuthModule,
    DatabaseModule,
    // RoleModule,
    // PermissionModule,
    // TwofaModule,
    SystemModule,
    PortfolioModule,
    OrderProjectModule,
    // FeatureModule,
    // AboutModule,
    SeedModule,
    ScreenModule,
    EstimateModule,
    TagModule,
    LoggerModule,
    TypeModule,
    AboutModule,
    BlogModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, FileManagerService, LoggerService, MailService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  // }
}
