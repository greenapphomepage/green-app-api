import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/user';
import { UserService } from '../user/user.service';
import { JwtStrategy } from './jwt.strategy';
import { Roles } from 'src/entities/roles';
import { Permissions } from 'src/entities/permission';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('ExpiresIn') },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Users, Roles, Permissions]),
  ],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    RefreshJwtStrategy,
    RoleService,
    PermissionService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
