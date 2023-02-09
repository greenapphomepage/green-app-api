import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from 'src/entities/permission';
import { Roles } from 'src/entities/roles';
import { Users } from 'src/entities/user';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles, Permissions])],
  providers: [PermissionService],
  controllers: [PermissionController],
})
export class PermissionModule {}
