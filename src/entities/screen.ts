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

@Entity('screens')
export class Screens {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  public id: number;

  @Column({ type: 'varchar', length: 255 })
  public type: string;

  @Column({ type: 'varchar', length: 255 })
  public tag: string;

  @Column({ type: 'varchar', length: 255 })
  public nameOption: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public image: string;

  @Column({ type: 'bigint' })
  public price: number;

  @Column({ type: 'bigint', nullable: true })
  public schedule: number;

  @Column({ type: 'int', default: 0 })
  public index: number;

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
