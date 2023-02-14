import { Module } from '@nestjs/common';
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
import { TwofaModule } from './modules/twofa/twofa.module';
import { SystemModule } from './modules/system/system.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { OrderProjectModule } from './modules/order-project/order-project.module';
import { FileManagerService } from './utils/file-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { FeatureModule } from './modules/feature/feature.module';
import { PreviewModule } from './modules/preview/preview.module';

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
        host: process.env.MAIL_HOST,

        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <server@thang.info> ',
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
    FeatureModule,
    PreviewModule,
  ],
  controllers: [AppController],
  providers: [AppService, FileManagerService],
})
export class AppModule {}
