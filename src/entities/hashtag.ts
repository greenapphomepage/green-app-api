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
  JoinTable,
  Index,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Blogs } from './blog';
import { BlogHashtag } from './blog_hashtag';

@Entity('hashtags')
export class HashTags extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  public id: number;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  public name: string;

  @OneToMany(() => BlogHashtag, (blogHashtag) => blogHashtag.hashTags)
  public blogHashtag: BlogHashtag[];

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
}
