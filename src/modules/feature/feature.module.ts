import { Module } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { FeatureController } from './feature.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Features } from '../../entities/feature';

@Module({
  imports: [TypeOrmModule.forFeature([Features])],
  providers: [FeatureService],
  controllers: [FeatureController],
})
export class FeatureModule {}
