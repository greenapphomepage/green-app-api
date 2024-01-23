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
import {PortfolioService} from "../portfolio.service";
import {SendResponse} from "../../../utils/send-response";

@ApiTags('Portfolios')
@Controller({
  path : 'portfolio',
  version : '2'
})
export class PortfolioV2Controller {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('')
  @ApiOperation({ summary: 'List Portfolios' })
  async listPortfolios() {
    try {
      const result = await this.portfolioService.list()
      return SendResponse.success(result);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
}
