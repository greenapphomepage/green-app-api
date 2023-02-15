import { Injectable } from '@nestjs/common';
import { Seeder } from '../../global/type/seeder';
import { Command } from 'nestjs-command';
import { InjectRepository } from '@nestjs/typeorm';
import { Previews } from '../../entities/preview';
import { Repository } from 'typeorm';

@Injectable()
export class PreviewSeed implements Seeder {
  constructor(
    @InjectRepository(Previews)
    private readonly previewRepository: Repository<Previews>,
  ) {}
  @Command({
    command: 'seed:preview',
    describe: 'create preview',
  })
  async up() {}

  @Command({
    command: 'seed:remove-preview',
    describe: 'remove preview',
  })
  async down() {
    console.log(`Removed preview`);
    return this.previewRepository.clear();
  }
}
