import { Injectable } from '@nestjs/common';
import { Seeder } from '../../global/type/seeder';
import { Command } from 'nestjs-command';
import { InjectRepository } from '@nestjs/typeorm';
import { Previews } from '../../entities/preview';
import { Repository } from 'typeorm';
import { programmingLanguage } from '../../entities/programmingLanguage';
import { Features } from '../../entities/feature';

@Injectable()
export class PreviewSeed implements Seeder {
  constructor(
    @InjectRepository(Previews)
    private readonly previewRepository: Repository<Previews>,
    @InjectRepository(programmingLanguage)
    private readonly languageRepository: Repository<programmingLanguage>,
    @InjectRepository(Features)
    private readonly featureRepo: Repository<Features>,
  ) {}
  @Command({
    command: 'create:preview',
    describe: 'create preview',
  })
  async up() {
    const platform = ['Android', 'IOS', 'Desktop', 'Web App'];
    const responsive = ['Desktop', 'Tablet', 'Mobile'];
    const language = await this.languageRepository.find();
    const features = await this.featureRepo.find();
    const data: Partial<Previews> = {
      key: 'preview',
      platform: JSON.stringify(platform),
      responsive: JSON.stringify(responsive),
      programmingLanguage: JSON.stringify(language.map((i) => i.name)),
      features,
    };
    await this.previewRepository.insert(data);
  }

  @Command({
    command: 'seed:remove-preview',
    describe: 'remove preview',
  })
  async down() {
    console.log(`Removed preview`);
    return this.previewRepository.clear();
  }
}
