import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/user';
import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UserService } from '../user/user.service';
import { TwofaController } from './twofa.controller';
import { TwofaService } from './twofa.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('ExpiresIn') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TwofaService, UserService, JwtStrategy],
  exports: [TwofaService],
  controllers: [TwofaController],
})
export class TwofaModule {}
