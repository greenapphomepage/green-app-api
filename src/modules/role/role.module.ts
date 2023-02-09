import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/entities/roles';
import { Users } from 'src/entities/user';
import { Permissions } from 'src/entities/permission';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles, Permissions])],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
