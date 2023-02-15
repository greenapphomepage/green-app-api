import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Previews } from '../../entities/preview';
import { PreviewSeed } from './preview.seed';
import { programmingLanguage } from '../../entities/programmingLanguage';
import { Features } from '../../entities/feature';
import { LanguageSeed } from './language.seed';
import { FeatureSeed } from './feature.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([Previews, programmingLanguage, Features]),
    CommandModule,
  ],
  providers: [PreviewSeed, LanguageSeed, FeatureSeed],
})
export class SeedModule {}
