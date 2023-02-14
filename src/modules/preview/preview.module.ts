import { Module } from '@nestjs/common';
import { PreviewService } from './preview.service';
import { PreviewController } from './preview.controller';

@Module({
  providers: [PreviewService],
  controllers: [PreviewController]
})
export class PreviewModule {}
