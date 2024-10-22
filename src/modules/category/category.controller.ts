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
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorator/auth.decorator';
import { SendResponse } from '../../utils/send-response';
import { CustomIntPipe } from '../../pipe/param_validation.pipe';
import { DeletePortfolioDto } from '../portfolio/dto/delete-portfolio.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FilterListTagDto } from './dto/filter-category.dto';
import { UpDownDto } from '../screen/dto/up-down.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Categories' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Post()
  async createCategories(@Body() body: CreateCategoryDto) {
    try {
      const newCategory = await this.categoryService.createCategory(body);
      return SendResponse.success(newCategory);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Categories' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Put(':id')
  async updateCategories(
    @Body() body: UpdateCategoryDto,
    @Param('id', CustomIntPipe) id: number,
  ) {
    try {
      body.id = id;
      const newCategories = await this.categoryService.updateCategory(body);
      return SendResponse.success(newCategories);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @Get('')
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'List Categories' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  async listCategories() {
    try {
      const categories = await this.categoryService.listCategory();
      return SendResponse.success(categories);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Detail Categories' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  @Get(':id')
  async detailCategories(@Param('id', CustomIntPipe) id: number) {
    try {
      const portfolios = await this.categoryService.detailCategory(id);
      return SendResponse.success(portfolios);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Categories' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Delete(':id')
  async deleteCategories(@Param('id', CustomIntPipe) id: number) {
    try {
      const portfolios = await this.categoryService.deleteCategory(id);
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
        order = await this.categoryService.deleteSelected(body.ids);
      } else {
        order = await this.categoryService.deleteAll();
      }
      return SendResponse.success(order);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
}
