import { Injectable } from '@nestjs/common';
import {
  DataSource,
  FindOptionsWhere,
  LessThan,
  Like,
  MoreThan,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
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
import { BlogHashtag } from '../../entities/blog_hashtag';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blogs)
    private readonly blogRepo: Repository<Blogs>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(HashTags)
    private readonly hashTagRepo: Repository<HashTags>,
    @InjectRepository(BlogHashtag)
    private readonly blogHashTagRepo: Repository<BlogHashtag>,
    private dataSource: DataSource,
  ) {}
  async createBlog(body: CreateBlogDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { hashTags } = body;
      const category = await this.categoryRepo.findOneOrFail({
        where: { id: body.categoryId },
      });
      //find or create list hashTags
      const listHashTags = [];
      if (hashTags) {
        for (const tag of hashTags) {
          const checkTag = await this.findOrCreateHashtag(tag);
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
      const blog = queryRunner.manager.create(Blogs, {
        ...body,
        slug,
        category,
        order: new Date().getTime(),
      });
      await queryRunner.manager.save(blog);
      for (const hT of listHashTags) {
        const blogHashtag = queryRunner.manager.create(BlogHashtag, {
          blogs: blog,
          hashTags: hT,
        });
        await queryRunner.manager.save(blogHashtag);
      }
      await queryRunner.commitTransaction();
      return blog;
    } catch (e) {
      console.log({ e });
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
  async updateBlog(body: UpdateBlogDto) {
    try {
      const { id, ...payload } = body;
      const checkBlog = await this.blogRepo.findOneOrFail({
        where: { id },
        relations: {
          category: true,
        },
      });
      if (payload.title && checkBlog.title !== payload.title) {
        let slug = generateSlug(payload.title);
        const checkSlug = await this.blogRepo.findOne({ where: { slug } });
        if (checkSlug) {
          slug = slug + '-' + uuid.v4();
        }
        payload.slug = slug;
      }
      const newEntity = extend(checkBlog, payload);
      if (payload.categoryId && checkBlog.category.id !== payload.categoryId) {
        newEntity.category = await this.categoryRepo.findOneOrFail({
          where: { id: payload.categoryId },
        });
      }
      if (payload.hashTags && payload.hashTags.length) {
        const listHashTags = [];
        for (const tag of payload.hashTags) {
          const checkTag = await this.findOrCreateHashtag(tag);
          listHashTags.push(checkTag);
        }
        await this.blogHashTagRepo.delete({
          blogs: { id },
        });
        for (const hT of listHashTags) {
          await this.blogHashTagRepo
            .create({
              blogs: newEntity,
              hashTags: hT,
            })
            .save();
        }
      }
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
          blogHashtag: {
            hashTags: true,
          },
          category: true,
        },
      });
      list.forEach((i) => {
        i['hashTags'] = i.blogHashtag.map((j) => j.hashTags);
        delete i.blogHashtag;
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
      const detail = await this.blogRepo.findOneOrFail({
        where,
        relations: {
          category: true,
          blogHashtag: {
            hashTags: true,
          },
        },
      });
      detail['hashTags'] = detail.blogHashtag.map((i) => i.hashTags);
      delete detail.blogHashtag;
      return detail;
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

  async findOrCreateHashtag(name: string) {
    const check = await this.hashTagRepo.findOne({
      where: {
        name,
      },
    });
    if (check) return check;
    return this.hashTagRepo.create({ name }).save();
  }
}
