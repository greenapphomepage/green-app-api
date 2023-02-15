import { Injectable } from '@nestjs/common';
import { Seeder } from '../../global/type/seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Previews } from '../../entities/preview';
import { Repository } from 'typeorm';
import { programmingLanguage } from '../../entities/programmingLanguage';
import { Command } from 'nestjs-command';
import { Features } from '../../entities/feature';

@Injectable()
export class FeatureSeed implements Seeder {
  constructor(
    @InjectRepository(Features)
    private readonly featureRepo: Repository<Features>,
  ) {}
  @Command({
    command: 'seed:feature',
    describe: 'create feature',
  })
  async up() {}

  @Command({
    command: 'seed:remove-feature',
    describe: 'remove feature',
  })
  async down() {
    console.log(`Removed feature`);
    return this.featureRepo.clear();
  }
}
