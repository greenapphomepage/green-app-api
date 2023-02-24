import { Module } from '@nestjs/common';
import { TypeService } from './type.service';
import { TypeController } from './type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Types } from '../../entities/type';
import { Tags } from '../../entities/tags';
import { Screens } from '../../entities/screen';
import { TagService } from '../tag/tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Types, Tags, Screens])],
  providers: [TypeService, TagService],
  controllers: [TypeController],
})
export class TypeModule {}
