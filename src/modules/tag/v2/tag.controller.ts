import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {TagService} from "../tag.service";
import {SendResponse} from "../../../utils/send-response";
import { filterListTagV2Dto} from "../dto/filter-tag.dto";

@ApiTags('Tag')
@Controller({
  path : 'tag',
  version : '2'
})
export class TagV2Controller {
  constructor(private readonly tagService: TagService) {}


  @Get('')
  @ApiOperation({ summary: 'List Tags' })
  async listTags(@Query() query: filterListTagV2Dto) {
    try {

      const result = await this.tagService.list(query);

      return SendResponse.success(result);
    } catch (e) {
      console.log(e)
      return SendResponse.error(e);
    }
  }

}
