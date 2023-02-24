import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tags } from '../../entities/tags';
import { Screens } from '../../entities/screen';
import { Types } from '../../entities/type';

@Module({
  imports: [TypeOrmModule.forFeature([Tags, Screens, Types])],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
