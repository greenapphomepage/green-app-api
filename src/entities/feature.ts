import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  AfterLoad,
} from 'typeorm';

@Entity('features')
export class Features {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  public featureId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  public featureKey: string;

  @Column({ type: 'varchar', length: 50 })
  public featureName: string;

  @Column({ type: 'text' })
  public extra: string;

  @CreateDateColumn({ name: 'created_at' })
  public created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deleted_at: Date;

  @AfterLoad()
  convert() {
    this.featureId = Number(this.featureId);
    this.extra = JSON.parse(this.extra);
  }
}
