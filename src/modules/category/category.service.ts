import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Tags } from '../../entities/tags';
import { InjectRepository } from '@nestjs/typeorm';
import code from '../../config/code';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryListDto } from '../../global/dto/query-list.dto';
import { Category } from '../../entities/category';
import { generateSlug } from '../../utils/slug';
import * as uuid from 'uuid';
import { extend } from 'lodash';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async createCategory(body: CreateCategoryDto) {
    try {
      const blog = this.categoryRepo.create({
        ...body,
      });
      return this.categoryRepo.save(blog);
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async updateCategory(body: UpdateCategoryDto) {
    try {
      const { id, ...payload } = body;
      const checkCategory = await this.categoryRepo.findOneOrFail({
        where: { id },
      });
      const newEntity = extend(checkCategory, payload);
      return this.categoryRepo.save(newEntity);
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async listCategory() {
    try {
      return this.categoryRepo.find();
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async detailCategory(id: number) {
    try {
      return this.categoryRepo.findOneOrFail({
        where: { id },
      });
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async deleteCategory(id: number) {
    try {
      const option = await this.categoryRepo.findOneOrFail({
        where: { id },
      });
      await this.categoryRepo.remove(option);
      return 'Done';
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async deleteAll() {
    try {
      await this.categoryRepo.clear();
      return { msg: 'Done' };
    } catch (e) {
      throw e;
      console.log(e);
    }
  }

  async deleteSelected(ids: number[]) {
    try {
      const listSelected: Category[] = [];
      for (const id of ids) {
        const option = await this.categoryRepo.findOneOrFail({
          where: { id },
        });
        listSelected.push(option);
      }
      await this.categoryRepo.remove(listSelected);
      return { msg: 'Done' };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
