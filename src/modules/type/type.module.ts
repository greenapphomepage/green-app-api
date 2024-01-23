import { Module } from '@nestjs/common';
import { TypeService } from './type.service';
import { TypeController } from './type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Types } from '../../entities/type';
import { Tags } from '../../entities/tags';
import { Screens } from '../../entities/screen';
import { TagService } from '../tag/tag.service';
import { OrderProjectService } from '../order-project/order-project.service';
import { OrderProject } from '../../entities/order-project';
import { MailService } from '../../utils/mail';
import {TypeV2Controller} from "./v2/type.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Types, Tags, Screens, OrderProject])],
  providers: [TypeService, TagService, OrderProjectService, MailService],
  controllers: [TypeController,TypeV2Controller],
})
export class TypeModule {}
