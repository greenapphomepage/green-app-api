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
import { OrderProjectService } from '../order-project/order-project.service';

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

    private readonly orderService: OrderProjectService,
  ) {}

  async createTypes(body: CreateTypeDto) {
    try {
      const { name } = body;
      let index: number;
      const list = await this.tagRepo.find({ order: { index: 'ASC' } });
      if (!list.length) {
        index = 1000;
      } else {
        index = list[0].index - 1;
      }
      const checkTypes = await this.typeRepo.findOne({
        where: { name, index },
      });
      if (checkTypes) {
        throw code.TYPE_EXISTED.type;
      }
      const newTypes = await this.typeRepo.create({ name });
      await this.typeRepo.save(newTypes);
      return newTypes;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async updateTypes(body: UpdateTypeDto) {
    try {
      const { id, name } = body;
      const checkTypes = await this.typeRepo.findOne({
        where: { id },
      });
      if (!checkTypes) {
        throw code.TYPE_NOT_FOUND.type;
      }

      if (name && name !== checkTypes.name) {
        await this.tagRepo.update({ type: checkTypes.name }, { type: name });
        await this.screenRepo.update({ type: checkTypes.name }, { type: name });
        await this.orderService.updateOptionByType(checkTypes.name, name);
        checkTypes.name = name;
      }

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
        order: { index: sort as SORT },
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
        throw code.TYPE_NOT_FOUND.type;
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
          throw code.TYPE_NOT_FOUND.type;
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

  async upDown(id: number, type: 'UP' | 'DOWN') {
    try {
      const checkType = await this.typeRepo.findOne({
        where: { id },
      });
      if (!checkType) {
        throw code.TAG_NOT_FOUND.type;
      }
      const list = await this.typeRepo.find({
        order: { index: 'DESC' },
      });
      const pos = list.map((item) => item.id).indexOf(checkType.id);
      if (type === 'UP') {
        if (pos === 0) {
          throw code.CAN_NOT_UP.type;
        }
        await this.typeRepo.update(
          { id: list[pos - 1].id },
          { index: checkType.index },
        );
        checkType.index = list[pos - 1].index;
      } else {
        if (pos === list.length - 1) {
          throw code.CAN_NOT_DOWN.type;
        }
        await this.typeRepo.update(
          { id: list[pos + 1].id },
          { index: checkType.index },
        );
        checkType.index = list[pos + 1].index;
      }
      await this.typeRepo.save(checkType);
      return { msg: 'Done' };
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
}
