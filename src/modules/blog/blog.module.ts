import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blogs } from '../../entities/blog';
import { HashTags } from '../../entities/hashtag';
import { Category } from '../../entities/category';

@Module({
  imports: [TypeOrmModule.forFeature([Blogs, HashTags, Category])],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}