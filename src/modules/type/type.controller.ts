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
import { TypeService } from './type.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorator/auth.decorator';
import { SendResponse } from '../../utils/send-response';
import { CustomIntPipe } from '../../pipe/param_validation.pipe';
import { DeletePortfolioDto } from '../portfolio/dto/delete-portfolio.dto';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { QueryListDto } from '../../global/dto/query-list.dto';
import { UpDownDto } from '../screen/dto/up-down.dto';

@ApiTags('Type')
@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Types' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Post()
  async createTypes(@Body() body: CreateTypeDto) {
    try {
      const newTag = await this.typeService.createTypes(body);
      return SendResponse.success(newTag);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Types' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Put(':id')
  async updateTypes(
    @Body() body: UpdateTypeDto,
    @Param('id', CustomIntPipe) id: number,
  ) {
    try {
      body.id = id;
      const newTypes = await this.typeService.updateTypes(body);
      return SendResponse.success(newTypes);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @Get('')
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'List Types' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  async listTypes(@Query() query: QueryListDto) {
    try {
      query.perPage = !query.perPage ? 10 : query.perPage;
      query.page = !query.page ? 1 : query.page;
      query.sort = query.sort ? query.sort.toUpperCase() : 'ASC';
      const result = await this.typeService.listTypes(query);
      const pagi = (result.count / query.perPage) | 0;
      const pages = result.count % query.perPage == 0 ? pagi : pagi + 1;
      const page = +query.page;
      const total = result.count;
      return SendResponse.success({
        page,
        pages,
        total,
        listTypes: result.list,
      });
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Detail Types' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  @Get(':id')
  async detailTypes(@Param('id', CustomIntPipe) id: number) {
    try {
      const portfolios = await this.typeService.detailTypes(id);
      return SendResponse.success(portfolios);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Types' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Delete(':id')
  async deleteTypes(@Param('id', CustomIntPipe) id: number) {
    try {
      const portfolios = await this.typeService.deleteTypes(id);
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
        order = await this.typeService.deleteSelected(body.ids);
      } else {
        order = await this.typeService.deleteAll();
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
      const result = await this.typeService.upDown(id, body.type);
      return SendResponse.success(result);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
}
