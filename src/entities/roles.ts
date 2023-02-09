import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user';
import { Permissions } from './permission';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  public role_id: number;

  @Column({ type: 'varchar', length: 30 })
  public role_key: string;

  @Column({ type: 'varchar', length: 30 })
  public role_name: string;

  @ManyToMany(() => Permissions, (permissions) => permissions.roles)
  @JoinTable({
    name: 'pivot_role_permission',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'role_id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'permission_id',
    },
  })
  permissions: Permissions[];
  @ManyToMany(() => Users, (users) => users.roles)
  users: Users[];

  @CreateDateColumn({ name: 'created_at' })
  public created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deleted_at: Date;
}
