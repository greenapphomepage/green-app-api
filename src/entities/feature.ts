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
import { Previews } from './preview';

@Entity('features')
export class Features {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  public featureId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  public featureKey: string;

  @Column({ type: 'varchar', length: 50 })
  public featureName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public image: string;

  @Column({ type: 'text' })
  public extra: string;

  @ManyToOne(() => Previews, (previews) => previews.features, { cascade: true })
  @JoinColumn({
    name: 'previewId',
    referencedColumnName: 'previewId',
  })
  preview: Previews;

  @CreateDateColumn({ name: 'created_at' })
  public created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deleted_at: Date;

  @AfterLoad()
  convert() {
    this.featureId = Number(this.featureId);
  }
}
