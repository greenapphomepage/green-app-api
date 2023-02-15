import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  AfterLoad,
  OneToMany,
} from 'typeorm';
import { Features } from './feature';

@Entity('preview')
export class Previews {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  public previewId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  public key: string;

  @Column({ type: 'text' })
  public programmingLanguage: string;

  @Column({ type: 'text' })
  public platform: string;

  @Column({ type: 'text' })
  public responsive: string;

  @OneToMany(() => Features, (feature) => feature.preview)
  features: Features[];

  @CreateDateColumn({ name: 'created_at' })
  public created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deleted_at: Date;

  @AfterLoad()
  convert() {
    this.previewId = Number(this.previewId);
  }
}
