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
import { BlogService } from './blog.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorator/auth.decorator';
import { SendResponse } from '../../utils/send-response';
import { CustomIntPipe } from '../../pipe/param_validation.pipe';
import { DeletePortfolioDto } from '../portfolio/dto/delete-portfolio.dto';
import { QueryListDto } from '../../global/dto/query-list.dto';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { UpDownDto } from './dto/upDown.dto';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Blog' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Post()
  async createBlog(@Body() body: CreateBlogDto) {
    try {
      const newBlog = await this.blogService.createBlog(body);
      return SendResponse.success(newBlog);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Blog' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Put(':id')
  async updateBlog(@Body() body: UpdateBlogDto, @Param('id') id: number) {
    try {
      body.id = id;
      const newBlog = await this.blogService.updateBlog(body);
      return SendResponse.success(newBlog);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @Get('')
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'List Blog' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  async listBlog(@Query() query: QueryListDto) {
    try {
      query.perPage = !query.perPage ? 10 : query.perPage;
      query.page = !query.page ? 1 : query.page;
      query.sort = query.sort ? query.sort.toUpperCase() : 'ASC';
      const result = await this.blogService.listBlog(query);
      const pagi = (result.count / query.perPage) | 0;
      const pages = result.count % query.perPage == 0 ? pagi : pagi + 1;
      const page = +query.page;
      const total = result.count;
      return SendResponse.success({
        page,
        pages,
        total,
        listBlog: result.list,
      });
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Detail Blog' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  @Get(':id')
  async detailBlog(@Param('id') id: number | string) {
    try {
      const portfolios = await this.blogService.detailBlog(id);
      return SendResponse.success(portfolios);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Blog' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Delete(':id')
  async deleteBlog(@Param('id', CustomIntPipe) id: number) {
    try {
      const portfolios = await this.blogService.deleteBlog(id);
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
        order = await this.blogService.deleteSelected(body.ids);
      } else {
        order = await this.blogService.deleteAll();
      }
      return SendResponse.success(order);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Up or down item' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Put('order/:id')
  async orderBlog(
    @Param('id', CustomIntPipe) id: number,
    @Body() { type }: UpDownDto,
  ) {
    try {
      const order = await this.blogService.upOrDown(id, type);
      return SendResponse.success(order);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
}
