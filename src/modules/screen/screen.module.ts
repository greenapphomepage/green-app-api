import { Module } from '@nestjs/common';
import { ScreenService } from './screen.service';
import { ScreenController } from './screen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Screens } from '../../entities/screen';
import { Tags } from '../../entities/tags';

@Module({
  imports: [TypeOrmModule.forFeature([Screens, Tags])],
  providers: [ScreenService],
  controllers: [ScreenController],
})
export class ScreenModule {}
