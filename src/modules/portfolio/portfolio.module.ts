import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolios } from '../../entities/portfolio';
import {PortfolioV2Controller} from "./v2/portfolio.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Portfolios])],
  providers: [PortfolioService],
  controllers: [PortfolioController,PortfolioV2Controller],
})
export class PortfolioModule {}
