import { Module } from '@nestjs/common';
import { OrderProjectService } from './order-project.service';
import { OrderProjectController } from './order-project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProject } from '../../entities/order-project';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProject])],
  providers: [OrderProjectService],
  controllers: [OrderProjectController],
})
export class OrderProjectModule {}
