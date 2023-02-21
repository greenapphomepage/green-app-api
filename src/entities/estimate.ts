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
} from 'typeorm';
import { OrderProject } from './order-project';

@Entity('estimate')
export class Estimate {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  public id: number;

  @Column({ type: 'varchar', length: 255 })
  public type: string;

  @Column({ type: 'varchar', length: 255 })
  public nameOption: string;

  @Column({ type: 'bigint' })
  public price: number;

  @Column({ type: 'bigint', nullable: true })
  public schedule: number;

  @Column({ type: 'varchar', length: 255 })
  public tag: string;

  @Column({ type: 'int', default: 0 })
  public status: number;

  @Column({ name: 'orderId', type: 'bigint', nullable: true })
  orderId: number;

  // @ManyToOne(() => OrderProject, (order) => order.estimate, {
  //   cascade: true,
  // })
  // @JoinColumn({
  //   name: 'orderId',
  //   referencedColumnName: 'orderId',
  // })
  // order: OrderProject;

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
