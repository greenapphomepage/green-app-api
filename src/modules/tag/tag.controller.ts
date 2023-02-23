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
import { TagService } from './tag.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorator/auth.decorator';
import { SendResponse } from '../../utils/send-response';
import { CustomIntPipe } from '../../pipe/param_validation.pipe';
import { DeletePortfolioDto } from '../portfolio/dto/delete-portfolio.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { FilterListTagDto } from './dto/filter-tag.dto';
import { UpDownDto } from '../screen/dto/up-down.dto';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Tags' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Post()
  async createTags(@Body() body: CreateTagDto) {
    try {
      const newTag = await this.tagService.createTags(body);
      return SendResponse.success(newTag);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Tags' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Put(':id')
  async updateTags(
    @Body() body: UpdateTagDto,
    @Param('id', CustomIntPipe) id: number,
  ) {
    try {
      body.id = id;
      const newTags = await this.tagService.updateTags(body);
      return SendResponse.success(newTags);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @Get('')
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'List Tags' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  async listTags(@Query() query: FilterListTagDto) {
    try {
      query.perPage = !query.perPage ? 10 : query.perPage;
      query.page = !query.page ? 1 : query.page;
      query.sort ? query.sort.toUpperCase() : 'DESC';
      const result = await this.tagService.listTags(query);
      const pagi = (result.count / query.perPage) | 0;
      const pages = result.count % query.perPage == 0 ? pagi : pagi + 1;
      const page = +query.page;
      const total = result.count;
      return SendResponse.success({
        page,
        pages,
        total,
        listTags: result.list,
      });
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Detail Tags' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  @Get(':id')
  async detailTags(@Param('id', CustomIntPipe) id: number) {
    try {
      const portfolios = await this.tagService.detailTags(id);
      return SendResponse.success(portfolios);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Tags' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Delete(':id')
  async deleteTags(@Param('id', CustomIntPipe) id: number) {
    try {
      const portfolios = await this.tagService.deleteTags(id);
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
        order = await this.tagService.deleteSelected(body.ids);
      } else {
        order = await this.tagService.deleteAll();
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
      const result = await this.tagService.upDown(id, body.type);
      return SendResponse.success(result);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
}
