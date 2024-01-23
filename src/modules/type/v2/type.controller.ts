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
import {TypeService} from "../type.service";
import {SendResponse} from "../../../utils/send-response";

@ApiTags('Type')
@Controller({
  path : 'type',
  version : '2'
})
export class TypeV2Controller {
  constructor(private readonly typeService: TypeService) {}


  @Get('')
  @ApiOperation({ summary: 'List Types' })
  async listTypes() {
    try {
      const result = await this.typeService.list();
      return SendResponse.success(result);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

}
