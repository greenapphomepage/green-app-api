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
import { PortfolioService } from './portfolio.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorator/auth.decorator';
import { SendResponse } from '../../utils/send-response';
import { CustomIntPipe } from '../../pipe/param_validation.pipe';
import { QueryListDto } from '../../global/dto/query-list.dto';
import { CreatePortfoliosDto } from './dto/create-portfolio.dto';
import { UpdatePortfoliosDto } from './dto/update-portfolio.dto';
import { DeletePortfolioDto } from './dto/delete-portfolio.dto';

@ApiTags('Portfolios')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @ApiOperation({ summary: 'Get Images' })
  @ApiBearerAuth()
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Get('images/:id')
  async getImages(@Param('id', CustomIntPipe) id: number) {
    try {
      const images = await this.portfolioService.getListImages(id);
      return SendResponse.success(images);
    } catch (e) {
      console.log(e);
      return SendResponse.error(e);
    }
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Portfolios' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Post()
  async createPortfolios(@Body() body: CreatePortfoliosDto) {
    try {
      const newPortfolios = await this.portfolioService.createPortfolios(body);
      return SendResponse.success(newPortfolios);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Portfolios' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Put(':id')
  async updatePortfolios(
    @Body() body: UpdatePortfoliosDto,
    @Param('id', CustomIntPipe) id: number,
  ) {
    try {
      body.id = id;
      const newPortfolios = await this.portfolioService.updatePortfolios(body);
      return SendResponse.success(newPortfolios);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @Get('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List Portfolios' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  async listPortfolios(@Query() query: QueryListDto) {
    try {
      query.perPage = !query.perPage ? 10 : query.perPage;
      query.page = !query.page ? 1 : query.page;
      query.sort ? query.sort.toUpperCase() : 'DESC';
      const result = await this.portfolioService.listPortfolios(query);
      const pagi = (result.count / query.perPage) | 0;
      const pages = result.count % query.perPage == 0 ? pagi : pagi + 1;
      const page = +query.page;
      const total = result.count;
      return SendResponse.success({
        page,
        pages,
        total,
        listPortfolios: result.list,
      });
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detail Portfolios' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Get(':id')
  async detailPortfolios(@Param('id', CustomIntPipe) id: number) {
    try {
      const portfolios = await this.portfolioService.detailPortfolios(id);
      return SendResponse.success(portfolios);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Portfolios' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Delete(':id')
  async deletePortfolios(@Param('id', CustomIntPipe) id: number) {
    try {
      const portfolios = await this.portfolioService.deletePortfolios(id);
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
        order = await this.portfolioService.deleteSelected(body.ids);
      } else {
        order = await this.portfolioService.deleteAll();
      }
      return SendResponse.success(order);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
}
