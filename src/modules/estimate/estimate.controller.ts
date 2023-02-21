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
import { EstimateService } from './estimate.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorator/auth.decorator';
import { SendResponse } from '../../utils/send-response';
import { CustomIntPipe } from '../../pipe/param_validation.pipe';
import { DeletePortfolioDto } from '../portfolio/dto/delete-portfolio.dto';
import { QueryListDto } from '../../global/dto/query-list.dto';
import { CreateEstimateDto } from './dto/create-estimate.dto';
import { UpdateEstimateDto } from './dto/update-estimate.dto';

@ApiTags('Estimate')
@Controller('estimate')
export class EstimateController {
  constructor(private readonly estimateService: EstimateService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Estimate' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Post()
  async createEstimate(@Body() body: CreateEstimateDto) {
    try {
      const newEstimate = await this.estimateService.createEstimate(body);
      return SendResponse.success(newEstimate);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Estimate' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Put(':id')
  async updateEstimate(
    @Body() body: UpdateEstimateDto,
    @Param('id', CustomIntPipe) id: number,
  ) {
    try {
      body.id = id;
      const newEstimate = await this.estimateService.updateEstimate(body);
      return SendResponse.success(newEstimate);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @Get('')
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'List Estimate' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  async listEstimate(@Query() query: QueryListDto) {
    try {
      query.perPage = !query.perPage ? 10 : query.perPage;
      query.page = !query.page ? 1 : query.page;
      query.sort ? query.sort.toUpperCase() : 'DESC';
      const result = await this.estimateService.listEstimate(query);
      const pagi = (result.count / query.perPage) | 0;
      const pages = result.count % query.perPage == 0 ? pagi : pagi + 1;
      const page = +query.page;
      const total = result.count;
      return SendResponse.success({
        page,
        pages,
        total,
        listEstimate: result.list,
      });
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Detail Estimate' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  @Get(':id')
  async detailEstimate(@Param('id', CustomIntPipe) id: number) {
    try {
      const portfolios = await this.estimateService.detailEstimate(id);
      return SendResponse.success(portfolios);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Estimate' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Delete(':id')
  async deleteEstimate(@Param('id', CustomIntPipe) id: number) {
    try {
      const portfolios = await this.estimateService.deleteEstimate(id);
      return SendResponse.success(portfolios);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete all or selected' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Delete()
  async deleteAll(@Body() body: DeletePortfolioDto) {
    try {
      let order;
      if (body.ids && body.ids.length) {
        order = await this.estimateService.deleteSelected(body.ids);
      } else {
        order = await this.estimateService.deleteAll();
      }
      return SendResponse.success(order);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
}
