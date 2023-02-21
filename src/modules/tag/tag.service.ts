import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Tags } from '../../entities/tags';
import { InjectRepository } from '@nestjs/typeorm';
import code from '../../config/code';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { FilterListTagDto } from './dto/filter-tag.dto';
import { FileManagerService } from '../../utils/file-manager';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tags)
    private readonly tagRepo: Repository<Tags>,
  ) {}

  async createTags(body: CreateTagDto) {
    try {
      const { type, name } = body;
      const checkTags = await this.tagRepo.findOne({ where: { type, name } });
      if (checkTags) {
        throw code.TAG_EXISTED.type;
      }
      const newTags = await this.tagRepo.create({ type, name });
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
        order: { id: sort as SORT },
        where: {
          ...(type ? { type } : {}),
          ...(keyword ? { name: Like(`%${keyword}%`) } : {}),
        },
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
      const option = await this.tagRepo.findOne({
        where: { id },
      });
      if (!option) {
        throw code.OPTION_NOT_FOUND.type;
      }
      await this.tagRepo.remove(option);
      return 'Done';
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async deleteAll() {
    try {
      await this.tagRepo.clear();
      FileManagerService.RemovePictureAll('screen');
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
        const option = await this.tagRepo.findOne({
          where: { id },
        });
        if (!option) {
          throw code.OPTION_NOT_FOUND.type;
        }
        listSelected.push(option);
      }
      await this.tagRepo.remove(listSelected);
      return { msg: 'Done' };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
