import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {ScreenService} from "../screen.service";
import {SendResponse} from "../../../utils/send-response";
import {FilterListScreenDto, FilterListScreenV2Dto} from "../dto/filter-list-screen.dto";

@ApiTags('Option')
@Controller({
  path : 'option',
  version : '2'
})
export class ScreenV2Controller {
  constructor(private readonly screenService: ScreenService) {}

  @Get('')
  @ApiOperation({ summary: 'List Option' })
  async listOption(@Query() query: FilterListScreenV2Dto) {
    try {
      query.sort = query.sort ? query.sort.toUpperCase() : 'DESC';
      const result = await this.screenService.list(query);
      return SendResponse.success(result);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

}
