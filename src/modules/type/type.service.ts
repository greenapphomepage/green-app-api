import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Types } from '../../entities/type';
import { InjectRepository } from '@nestjs/typeorm';
import code from '../../config/code';
import { FilterListTagDto } from '../tag/dto/filter-tag.dto';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { QueryListDto } from '../../global/dto/query-list.dto';
import { TagService } from '../tag/tag.service';
import { Tags } from '../../entities/tags';
import { Screens } from '../../entities/screen';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Types)
    private readonly typeRepo: Repository<Types>,

    private readonly tagService: TagService,
    @InjectRepository(Tags)
    private readonly tagRepo: Repository<Tags>,
    @InjectRepository(Screens)
    private readonly screenRepo: Repository<Screens>,
  ) {}

  async createTypes(body: CreateTypeDto) {
    try {
      const { key, name } = body;
      const checkTypes = await this.typeRepo.findOne({
        where: { key },
      });
      if (checkTypes) {
        throw code.TYPE_EXISTED.type;
      }
      const newTypes = await this.typeRepo.create({ key, name });
      await this.typeRepo.save(newTypes);
      return newTypes;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async updateTypes(body: UpdateTypeDto) {
    try {
      const { id, key, name } = body;
      const checkTypes = await this.typeRepo.findOne({
        where: { id },
      });
      if (!checkTypes) {
        throw code.TYPE_NOT_FOUND.type;
      }
      if (key) {
        const getTypesByKey = await this.typeRepo.findOne({
          where: { key },
        });
        if (getTypesByKey && key !== checkTypes.key) {
          throw code.ROLE_EXISTED.type;
        }
        checkTypes.key = key;
      }
      checkTypes.name = name ? name : checkTypes.name;
      await this.typeRepo.save(checkTypes);
      return checkTypes;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async listTypes(query: QueryListDto) {
    try {
      const { keyword, page, perPage, sort } = query;
      const [list, count] = await this.typeRepo.findAndCount({
        skip: (page - 1) * perPage,
        take: perPage,
        order: { id: sort as SORT },
        where: {
          ...(keyword ? { name: Like(`%${keyword}%`) } : {}),
        },
      });
      return { list, count };
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async detailTypes(id: number) {
    try {
      const type = await this.typeRepo.findOne({ where: { id } });
      if (!type) {
        throw code.TYPE_NOT_FOUND.type;
      }
      return type;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async deleteTypes(id: number) {
    try {
      const type = await this.typeRepo.findOne({
        where: { id },
      });
      if (!type) {
        throw code.OPTION_NOT_FOUND.type;
      }
      const tags = await this.tagRepo.find({ where: { type: type.name } });
      const ids = tags.map((tag) => tag.id);
      if (ids.length) {
        await this.tagService.deleteSelected(ids);
      }
      await this.typeRepo.remove(type);
      return 'Done';
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async deleteAll() {
    try {
      await this.screenRepo.clear();
      await this.tagRepo.clear();
      await this.typeRepo.clear();
      return { msg: 'Done' };
    } catch (e) {
      throw e;
      console.log(e);
    }
  }

  async deleteSelected(ids: number[]) {
    try {
      const listSelected: Types[] = [];
      for (const id of ids) {
        const type = await this.typeRepo.findOne({
          where: { id },
        });
        if (!type) {
          throw code.OPTION_NOT_FOUND.type;
        }
        const tags = await this.tagRepo.find({ where: { type: type.name } });
        const ids = tags.map((tag) => tag.id);
        if (ids.length) {
          await this.tagService.deleteSelected(ids);
        }
        listSelected.push(type);
      }
      await this.typeRepo.remove(listSelected);
      return { msg: 'Done' };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
