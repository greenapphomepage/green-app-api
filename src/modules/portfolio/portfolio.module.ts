import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolios } from '../../entities/portfolio';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolios])],
  providers: [PortfolioService],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
