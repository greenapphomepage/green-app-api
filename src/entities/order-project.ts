import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlatformEnum } from '../enum/platform.enum';

@Entity('order_project')
export class OrderProject {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  public orderId: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  public projectName: string;

  @Column({ type: 'text', nullable: true })
  public planFile: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @Column({ type: 'int', nullable: true })
  public maximumBudget: number;

  @Column({ type: 'boolean', default: false })
  public governmentSupport: boolean;

  @Column({ type: 'varchar', length: 255 })
  public customerName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public companyName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public position: string;

  @Column({ type: 'varchar', length: 255 })
  public email: string;

  @Column({ type: 'varchar', length: 255 })
  public phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public presenter: string;

  @Column({
    type: 'enum',
    enum: PlatformEnum,
    default: PlatformEnum.NOTHING,
  })
  public platform: PlatformEnum;

  @Column({ type: 'boolean', default: false })
  public isDone: boolean;

  @Column({ type: 'int', nullable: true })
  public estimatedCost: number;

  @Column({ type: 'varchar', nullable: true })
  public estimatedTime: string;

  @CreateDateColumn({ name: 'created_at' })
  public created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deleted_at: Date;

  @AfterLoad()
  convertToNumber() {
    this.orderId = Number(this.orderId);
  }
}
