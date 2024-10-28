import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blogs } from './blog';
import { HashTags } from './hashtag';

@Entity('blog_hashtag')
export class BlogHashtag extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  public id: number;

  @Column({ type: 'bigint', unsigned: true })
  blogsId: number;

  @Column({ type: 'bigint', unsigned: true })
  hashtagsId: number;

  @ManyToOne(() => Blogs, (blogs) => blogs.blogHashtag, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blogsId' })
  blogs: Blogs;

  @ManyToOne(() => HashTags, (hashTags) => hashTags.blogHashtag, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hashtagsId' })
  hashTags: HashTags;
}
