import { Module } from '@nestjs/common';
import { ScreenService } from './screen.service';
import { ScreenController } from './screen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Screens } from '../../entities/screen';
import { Tags } from '../../entities/tags';
import {ScreenV2Controller} from "./v2/screen.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Screens, Tags])],
  providers: [ScreenService],
  controllers: [ScreenController,ScreenV2Controller],
})
export class ScreenModule {}
