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
} from 'typeorm';
import { HashTags } from './hashtag';

@Entity('blogs')
export class Blogs {
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

  @ManyToMany(() => HashTags, (hashTags) => hashTags.blogs)
  public hashTags: HashTags[];

  @CreateDateColumn({ name: 'created_at' })
  public created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deleted_at: Date;

  @AfterLoad()
  convert() {
    this.id = Number(this.id);
  }
  get thumbnail_url() {
    return `${process.env.IMAGE_URL}/${this.thumbnail}`;
  }
}
