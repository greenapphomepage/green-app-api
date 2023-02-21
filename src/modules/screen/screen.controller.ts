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
import { ScreenService } from './screen.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorator/auth.decorator';
import { CustomIntPipe } from '../../pipe/param_validation.pipe';
import { SendResponse } from '../../utils/send-response';
import { DeletePortfolioDto } from '../portfolio/dto/delete-portfolio.dto';
import { FilterListScreenDto } from './dto/filter-list-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpDownDto } from './dto/up-down.dto';

@ApiTags('Option')
@Controller('option')
export class ScreenController {
  constructor(private readonly screenService: ScreenService) {}
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Option' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Post()
  async createOption(@Body() body: CreateScreenDto) {
    try {
      const newOption = await this.screenService.createOption(body);
      return SendResponse.success(newOption);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Option' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Put(':id')
  async updateOption(
    @Body() body: UpdateScreenDto,
    @Param('id', CustomIntPipe) id: number,
  ) {
    try {
      body.id = id;
      const newOption = await this.screenService.updateOption(body);
      return SendResponse.success(newOption);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @Get('')
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'List Option' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  async listOption(@Query() query: FilterListScreenDto) {
    try {
      query.perPage = !query.perPage ? 10 : query.perPage;
      query.page = !query.page ? 1 : query.page;
      query.sort ? query.sort.toUpperCase() : 'DESC';
      const result = await this.screenService.listOption(query);
      const pagi = (result.count / query.perPage) | 0;
      const pages = result.count % query.perPage == 0 ? pagi : pagi + 1;
      const page = +query.page;
      const total = result.count;
      return SendResponse.success({
        page,
        pages,
        total,
        listOption: result.list,
      });
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Detail Option' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  @Get(':id')
  async detailOption(@Param('id', CustomIntPipe) id: number) {
    try {
      const portfolios = await this.screenService.detailOption(id);
      return SendResponse.success(portfolios);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Option' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Delete(':id')
  async deleteOption(@Param('id', CustomIntPipe) id: number) {
    try {
      const portfolios = await this.screenService.deleteOption(id);
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
        order = await this.screenService.deleteSelected(body.ids);
      } else {
        order = await this.screenService.deleteAll();
      }
      return SendResponse.success(order);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Up or down one row' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Put('up-down/:id')
  async upDown(
    @Body() body: UpDownDto,
    @Param('id', CustomIntPipe) id: number,
  ) {
    try {
      const result = await this.screenService.upDown(id, body.type);
      return SendResponse.success(result);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
}
