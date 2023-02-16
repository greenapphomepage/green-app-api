import { Body, Controller, Get, Put } from '@nestjs/common';
import { PreviewService } from './preview.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdatePreviewDto } from './dto/update.dto';
import { Auth } from '../../decorator/auth.decorator';

@ApiTags('Preview')
@Controller('preview')
export class PreviewController {
  constructor(private readonly previewService: PreviewService) {}
  @Get('')
  async getPreview() {
    return this.previewService.get();
  }

  @ApiBearerAuth()
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Put('')
  async update(@Body() body: UpdatePreviewDto) {
    return this.previewService.update(body);
  }
}
