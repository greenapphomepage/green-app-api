import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import code from 'src/config/code';
import { Roles } from 'src/entities/roles';
import { QueryListDto } from 'src/global/dto/query-list.dto';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { CreateRolesDto } from './dto/create-roles.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Roles)
    private readonly roleRepo: Repository<Roles>,
  ) {}
  async createRoles(body: CreateRolesDto) {
    try {
      const { role_key, role_name } = body;
      const checkRoles = await this.roleRepo.findOne({ where: { role_key } });
      if (checkRoles) {
        throw code.ROLE_EXISTED.type;
      }
      const newRoles = await this.roleRepo.create({ role_key, role_name });
      await this.roleRepo.save(newRoles);
      return newRoles;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async updateRoles(body: UpdateRolesDto) {
    try {
      const { id, role_key, role_name } = body;
      const checkRoles = await this.roleRepo.findOne({
        where: { role_id: id },
      });
      if (!checkRoles) {
        throw code.ROLE_NOT_FOUND.type;
      }
      if (role_key) {
        const getRolesByKey = await this.roleRepo.findOne({
          where: { role_key },
        });
        if (getRolesByKey && role_key !== checkRoles.role_key) {
          throw code.ROLE_EXISTED.type;
        }
        checkRoles.role_key = role_key;
      }
      checkRoles.role_name = role_name ? role_name : checkRoles.role_name;
      await this.roleRepo.save(checkRoles);
      return checkRoles;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async listRoles(query: QueryListDto) {
    try {
      const { keyword, page, perPage, sort } = query;
      const [list, count] = await this.roleRepo.findAndCount({
        skip: (page - 1) * perPage,
        take: perPage,
        order: { role_id: sort as SORT },
        where: keyword
          ? [
              {
                role_key: Like(`%${keyword}%`),
              },
              {
                role_name: Like(`%${keyword}%`),
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
  async detailRoles(id: number) {
    try {
      const role = await this.roleRepo.findOne({ where: { role_id: id } });
      if (!role) {
        throw code.ROLE_NOT_FOUND.type;
      }
      return role;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
}
