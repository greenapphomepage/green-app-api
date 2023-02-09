import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  AfterLoad,
} from 'typeorm';
import { Users } from './user';

@Entity('refresh_token')
export class RefreshToken {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  public id: number;

  @Column({ type: 'varchar', length: 255 })
  public ip: string;

  @Column({ type: 'varchar', length: 255 })
  userAgent: string;

  @Index()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  browser: string;

  @Index()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  os: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  refreshHash?: string;

  @ManyToOne(() => Users, (user) => user.refreshToken, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'user_id',
  })
  user: Users;

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
