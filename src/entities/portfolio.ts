import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('portfolios')
export class Portfolios {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  public portfolio_id: number;

  @Column({ type: 'varchar', length: 30 })
  public portfolio_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public logo: string;

  @Column({ type: 'varchar', length: 255 })
  public title: string;

  @Column({ type: 'varchar', length: 255 })
  public programming_language: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @Column({ type: 'text', nullable: true })
  public images: string;

  @CreateDateColumn({ name: 'created_at' })
  public created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deleted_at: Date;

  @AfterLoad()
  convertToNumber() {
    this.portfolio_id = Number(this.portfolio_id);
  }
}
