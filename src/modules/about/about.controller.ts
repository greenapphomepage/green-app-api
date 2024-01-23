import { Body, Controller, Get, Put } from '@nestjs/common';
import { AboutService } from './about.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('About')
@Controller('about')
export class AboutController {
  constructor(private readonly previewService: AboutService) {}
  @Get('')
  async getImage() {
    return this.previewService.getImages()
  }
}
