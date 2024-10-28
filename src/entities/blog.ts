import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  AfterLoad,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  Index,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { HashTags } from './hashtag';
import { Category } from './category';
import { BlogHashtag } from './blog_hashtag';

@Entity('blogs')
export class Blogs extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  public id: number;

  @Column({ type: 'varchar', length: 255 })
  public title: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  public slug: string;

  @Column({ type: 'varchar', length: 255 })
  public thumbnail: string;

  @Column({ type: 'text' })
  public content: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @Column({ type: 'text', nullable: true })
  public keywords: string;

  @Column({ type: 'bigint', default: 0 })
  public order: number;

  @OneToMany(() => BlogHashtag, (blogHashtag) => blogHashtag.blogs)
  blogHashtag: BlogHashtag[];

  @ManyToOne(() => Category, (category) => category.blog, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  public category: Category;

  @CreateDateColumn({ name: 'created_at' })
  public created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deleted_at: Date;

  get thumbnail_url() {
    return `${process.env.IMAGE_URL}/${this.thumbnail}`;
  }

  @AfterLoad()
  convert() {
    this.id = Number(this.id);
  }
}
