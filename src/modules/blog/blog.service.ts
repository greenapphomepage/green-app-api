import { Injectable } from '@nestjs/common';
import {
  FindOptionsWhere,
  LessThan,
  Like,
  MoreThan,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import code from '../../config/code';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryListDto } from '../../global/dto/query-list.dto';
import { Blogs } from '../../entities/blog';
import { HashTags } from '../../entities/hashtag';
import { extend } from 'lodash';
import * as uuid from 'uuid';
import { generateSlug } from '../../utils/slug';
import { OrderType } from './enum/orderType';
import { Category } from '../../entities/category';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blogs)
    private readonly blogRepo: Repository<Blogs>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(HashTags)
    private readonly hashTagRepo: Repository<HashTags>,
  ) {}
  async createBlog(body: CreateBlogDto) {
    try {
      const { hashTags } = body;
      const category = await this.categoryRepo.findOneOrFail({
        where: { id: body.categoryId },
      });
      //find or create list hashTags
      const listHashTags = [];
      for (const tag of hashTags) {
        const checkTag = await this.hashTagRepo.findOne({
          where: { name: tag },
        });
        if (!checkTag) {
          const newTag = this.hashTagRepo.create({ name: tag });
          await this.hashTagRepo.save(newTag);
          listHashTags.push(newTag);
        } else {
          listHashTags.push(checkTag);
        }
      }
      let slug = generateSlug(body.title);
      const checkSlug = await this.blogRepo.findOne({
        where: { slug },
      });
      if (checkSlug) {
        slug = slug + '-' + uuid.v4();
      }
      const blog = this.blogRepo.create({
        ...body,
        hashTags: listHashTags,
        slug,
        category,
        order: new Date().getTime(),
      });
      return this.blogRepo.save(blog);
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async updateBlog(body: UpdateBlogDto) {
    try {
      const { id } = body;
      const checkBlog = await this.blogRepo.findOneOrFail({
        where: { id },
      });
      if (body.title && checkBlog.title !== body.title) {
        let slug = generateSlug(body.title);
        const checkSlug = await this.blogRepo.findOne({ where: { slug } });
        if (checkSlug) {
          slug = slug + '-' + uuid.v4();
        }
        body.slug = slug;
      }
      const newEntity = extend(checkBlog, body);
      return this.blogRepo.save(newEntity);
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async listBlog(query: QueryListDto) {
    try {
      const { keyword, page, perPage, sort } = query;
      const [list, count] = await this.blogRepo.findAndCount({
        skip: (page - 1) * perPage,
        take: perPage,
        order: { order: sort as SORT },
        where: keyword
          ? [
              {
                title: Like(`%${keyword}%`),
              },
              {
                slug: Like(`%${keyword}%`),
              },
            ]
          : {},
        relations: {
          hashTags: true,
          category: true,
        },
      });
      return { list, count };
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async detailBlog(id: number | string) {
    const where: FindOptionsWhere<Blogs> = {};
    if (typeof id === 'string' && isNaN(Number(id))) {
      where['slug'] = id;
    } else {
      where['id'] = Number(id);
    }
    try {
      return this.blogRepo.findOneOrFail({
        where,
        relations: {
          hashTags: true,
          category: true,
        },
      });
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async deleteBlog(id: number) {
    try {
      const option = await this.blogRepo.findOneOrFail({
        where: { id },
      });
      await this.blogRepo.remove(option);
      return 'Done';
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async deleteAll() {
    try {
      await this.blogRepo.clear();
      return { msg: 'Done' };
    } catch (e) {
      throw e;
      console.log(e);
    }
  }
  async deleteSelected(ids: number[]) {
    try {
      const listSelected: Blogs[] = [];
      for (const id of ids) {
        const option = await this.blogRepo.findOneOrFail({
          where: { id },
        });
        listSelected.push(option);
      }
      await this.blogRepo.remove(listSelected);
      return { msg: 'Done' };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  async upOrDown(id: number, type: OrderType) {
    try {
      const checkBlog = await this.blogRepo.findOneOrFail({
        where: { id },
      });
      const { order } = checkBlog;
      //if type is up , swap order with previous . if type is down , swap order with next
      if (type === OrderType.UP) {
        const previous = await this.blogRepo.findOne({
          where: { order: LessThan(order) },
          order: { order: 'DESC' },
        });
        if (previous) {
          checkBlog.order = previous.order;
          previous.order = order;
          await this.blogRepo.save(previous);
        }
      } else {
        const next = await this.blogRepo.findOne({
          where: { order: MoreThan(order) },
          order: { order: 'ASC' },
        });
        if (next) {
          checkBlog.order = next.order;
          next.order = order;
          await this.blogRepo.save(next);
        }
      }

      return this.blogRepo.save(checkBlog);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
