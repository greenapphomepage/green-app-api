import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blogs } from '../../entities/blog';
import { HashTags } from '../../entities/hashtag';
import { Category } from '../../entities/category';
import { BlogHashtag } from '../../entities/blog_hashtag';

@Module({
  imports: [TypeOrmModule.forFeature([Blogs, HashTags, Category, BlogHashtag])],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
