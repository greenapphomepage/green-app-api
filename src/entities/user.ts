import { Exclude } from 'class-transformer';
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
import { Permissions } from './permission';
import { Roles } from './roles';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  public user_id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  public user_email: string;

  @Column({ type: 'varchar', length: 255 })
  public user_password: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  refreshHash?: string;

  @ManyToMany(() => Permissions, (permissions) => permissions.users)
  @JoinTable({
    name: 'pivot_user_permission',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'user_id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'permission_id',
    },
  })
  permissions: Permissions[];

  @ManyToMany(() => Roles, (roles) => roles.users)
  @JoinTable({
    name: 'pivot_role_user',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'user_id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'role_id',
    },
  })
  roles: Roles[];

  @Exclude({
    toPlainOnly: true,
  })
  @Column({
    nullable: true,
  })
  twoFASecret?: string;

  @Exclude({
    toPlainOnly: true,
  })
  @Column({
    nullable: true,
    type: 'boolean',
  })
  isTwoFAEnabled?: boolean;

  @Exclude({
    toPlainOnly: true,
  })
  @CreateDateColumn({
    type: 'timestamp',
    // default: () => 'CURRENT_TIMESTAMP',
  })
  twoFAThrottleTime?: Date;

  @CreateDateColumn({ name: 'created_at' })
  public created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deleted_at: Date;
}
