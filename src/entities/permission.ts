import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from './roles';
import { Users } from './user';

@Entity('permissions')
export class Permissions {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  public permission_id: number;

  @Column({ type: 'varchar', length: 30 })
  public permission_key: string;

  @Column({ type: 'varchar', length: 30 })
  public permission_name: string;

  @ManyToMany(() => Roles, (roles) => roles.permissions)
  roles: Roles[];

  @ManyToMany(() => Users, (users) => users.permissions)
  users: Users[];

  @CreateDateColumn({ name: 'created_at' })
  public created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deleted_at: Date;
}
