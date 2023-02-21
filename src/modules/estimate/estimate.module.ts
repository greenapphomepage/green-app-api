import { Module } from '@nestjs/common';
import { EstimateService } from './estimate.service';
import { EstimateController } from './estimate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estimate } from '../../entities/estimate';

@Module({
  imports: [TypeOrmModule.forFeature([Estimate])],
  providers: [EstimateService],
  controllers: [EstimateController],
})
export class EstimateModule {}
