import { Module } from '@nestjs/common';
import { PreviewService } from './preview.service';
import { PreviewController } from './preview.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Previews } from '../../entities/preview';
import { Features } from '../../entities/feature';

@Module({
  imports: [TypeOrmModule.forFeature([Previews, Features])],
  providers: [PreviewService],
  controllers: [PreviewController],
})
export class PreviewModule {}
