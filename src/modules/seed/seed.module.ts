import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Previews } from '../../entities/preview';
import { PreviewSeed } from './preview.seed';
import { programmingLanguage } from '../../entities/programmingLanguage';

@Module({
  imports: [
    TypeOrmModule.forFeature([Previews, programmingLanguage]),
    CommandModule,
  ],
  providers: [PreviewSeed],
})
export class SeedModule {}
