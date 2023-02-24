import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Tags } from '../../entities/tags';
import { InjectRepository } from '@nestjs/typeorm';
import code from '../../config/code';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { FilterListTagDto } from './dto/filter-tag.dto';
import { Screens } from '../../entities/screen';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tags)
    private readonly tagRepo: Repository<Tags>,
    @InjectRepository(Screens)
    private readonly screenRepo: Repository<Screens>,
  ) {}

  async createTags(body: CreateTagDto) {
    try {
      let index: number;
      const list = await this.tagRepo.find({ order: { id: 'DESC' } });
      if (!list.length) {
        index = 1000;
      } else {
        index = list[0].index - 1;
      }
      const { type, name } = body;
      const checkTags = await this.tagRepo.findOne({
        where: { type, name },
      });
      if (checkTags) {
        throw code.TAG_EXISTED.type;
      }
      const newTags = await this.tagRepo.create({ type, name, index });
      await this.tagRepo.save(newTags);
      return newTags;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async updateTags(body: UpdateTagDto) {
    try {
      const { id, type, name } = body;
      const checkTags = await this.tagRepo.findOne({
        where: { id },
      });
      if (!checkTags) {
        throw code.TAG_NOT_FOUND.type;
      }
      if (type) {
        const getTagsByType = await this.tagRepo.findOne({
          where: { type, name },
        });
        if (getTagsByType && type !== checkTags.type) {
          throw code.TAG_EXISTED.type;
        }
        checkTags.type = type;
      }
      checkTags.name = name ? name : checkTags.name;
      await this.tagRepo.save(checkTags);
      return checkTags;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async listTags(query: FilterListTagDto) {
    try {
      const { keyword, page, perPage, sort, type } = query;
      const [list, count] = await this.tagRepo.findAndCount({
        skip: (page - 1) * perPage,
        take: perPage,
        order: { index: sort as SORT },
        where: {
          ...(type ? { type } : {}),
          ...(keyword ? { name: Like(`%${keyword}%`) } : {}),
        },
      });

      list.forEach((item) => {
        delete item.index;
      });
      return { list, count };
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async detailTags(id: number) {
    try {
      const role = await this.tagRepo.findOne({ where: { id } });
      if (!role) {
        throw code.TAG_NOT_FOUND.type;
      }
      return role;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async deleteTags(id: number) {
    try {
      const tag = await this.tagRepo.findOne({
        where: { id },
      });
      if (!tag) {
        throw code.OPTION_NOT_FOUND.type;
      }
      const option = await this.screenRepo.find({ where: { tag: tag.name } });
      await this.screenRepo.remove(option);
      await this.tagRepo.remove(tag);
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
      return { msg: 'Done' };
    } catch (e) {
      throw e;
      console.log(e);
    }
  }

  async deleteSelected(ids: number[]) {
    try {
      const listSelected: Tags[] = [];
      for (const id of ids) {
        const tag = await this.tagRepo.findOne({
          where: { id },
        });
        if (!tag) {
          throw code.OPTION_NOT_FOUND.type;
        }
        const option = await this.screenRepo.find({ where: { tag: tag.name } });
        await this.screenRepo.remove(option);
        listSelected.push(tag);
      }
      await this.tagRepo.remove(listSelected);
      return { msg: 'Done' };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async upDown(id: number, type: 'UP' | 'DOWN') {
    try {
      const checkTag = await this.tagRepo.findOne({
        where: { id },
      });
      if (!checkTag) {
        throw code.TAG_NOT_FOUND.type;
      }
      const list = await this.tagRepo.find({
        where: { type: checkTag.type },
        order: { index: 'DESC' },
      });
      const pos = list.map((item) => item.id).indexOf(checkTag.id);
      if (type === 'UP') {
        if (pos === 0) {
          throw code.CAN_NOT_UP.type;
        }
        await this.tagRepo.update(
          { id: list[pos - 1].id },
          { index: checkTag.index },
        );
        checkTag.index = list[pos - 1].index;
      } else {
        if (pos === list.length - 1) {
          throw code.CAN_NOT_DOWN.type;
        }
        await this.tagRepo.update(
          { id: list[pos + 1].id },
          { index: checkTag.index },
        );
        checkTag.index = list[pos + 1].index;
      }
      await this.tagRepo.save(checkTag);
      return { msg: 'Done' };
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
}
