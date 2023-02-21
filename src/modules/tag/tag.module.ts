import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tags } from '../../entities/tags';

@Module({
  imports: [TypeOrmModule.forFeature([Tags])],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
