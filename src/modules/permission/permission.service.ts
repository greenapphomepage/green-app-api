import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import code from 'src/config/code';
import { Permissions } from 'src/entities/permission';
import { QueryListDto } from 'src/global/dto/query-list.dto';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permissions)
    private readonly permissionRepo: Repository<Permissions>,
  ) {}

  async createPermissions(body: CreatePermissionDto) {
    try {
      const { permission_key, permission_name } = body;
      const checkPermissions = await this.permissionRepo.findOne({
        where: { permission_key },
      });
      if (checkPermissions) {
        throw code.PERMISSION_EXISTED.type;
      }
      const newPermissions = await this.permissionRepo.create({
        permission_key,
        permission_name,
      });
      await this.permissionRepo.save(newPermissions);
      return newPermissions;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async updatePermissions(body: UpdatePermissionDto) {
    try {
      const { id, permission_key, permission_name } = body;
      const checkPermissions = await this.permissionRepo.findOne({
        where: { permission_id: id },
      });
      if (!checkPermissions) {
        throw code.PERMISSION_NOT_FOUND.type;
      }
      if (permission_key) {
        const getPermissionsByKey = await this.permissionRepo.findOne({
          where: { permission_key },
        });
        if (
          getPermissionsByKey &&
          permission_key !== checkPermissions.permission_key
        ) {
          throw code.PERMISSION_EXISTED.type;
        }
        checkPermissions.permission_key = permission_key;
      }
      checkPermissions.permission_name = permission_name
        ? permission_name
        : checkPermissions.permission_name;
      await this.permissionRepo.save(checkPermissions);
      return checkPermissions;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async listPermissions(query: QueryListDto) {
    try {
      const { keyword, page, perPage, sort } = query;
      const [list, count] = await this.permissionRepo.findAndCount({
        skip: (page - 1) * perPage,
        take: perPage,
        order: { permission_id: sort as SORT },
        where: keyword
          ? [
              {
                permission_key: Like(`%${keyword}%`),
              },
              {
                permission_name: Like(`%${keyword}%`),
              },
            ]
          : {},
      });

      return { list, count };
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async detailPermissions(id: number) {
    try {
      const role = await this.permissionRepo.findOne({
        where: { permission_id: id },
      });
      if (!role) {
        throw code.PERMISSION_NOT_FOUND.type;
      }
      return role;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
}
