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
import { FeatureService } from './feature.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorator/auth.decorator';
import { SendResponse } from '../../utils/send-response';
import { CustomIntPipe } from '../../pipe/param_validation.pipe';
import { QueryListDto } from '../../global/dto/query-list.dto';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { DeleteOrderDto } from '../order-project/dto/delete-order.dto';

@ApiTags('Feature')
@Controller('feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Feature' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Post()
  async createFeature(@Body() body: CreateFeatureDto) {
    try {
      const newFeature = await this.featureService.createFeature(body);
      return SendResponse.success(newFeature);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Feature' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Put(':id')
  async updateFeature(
    @Body() body: UpdateFeatureDto,
    @Param('id', CustomIntPipe) id: number,
  ) {
    try {
      body.id = id;
      const newFeature = await this.featureService.updateFeature(body);
      return SendResponse.success(newFeature);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @Get('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List Feature' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  async listFeature(@Query() query: QueryListDto) {
    try {
      query.perPage = !query.perPage ? 10 : query.perPage;
      query.page = !query.page ? 1 : query.page;
      query.sort ? query.sort.toUpperCase() : 'DESC';
      const result = await this.featureService.listFeature(query);
      const pagi = (result.count / query.perPage) | 0;
      const pages = result.count % query.perPage == 0 ? pagi : pagi + 1;
      const page = +query.page;
      const total = result.count;
      return SendResponse.success({
        page,
        pages,
        total,
        listFeature: result.list,
      });
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detail Feature' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Get(':id')
  async detailFeature(@Param('id', CustomIntPipe) id: number) {
    try {
      const feature = await this.featureService.detailFeature(id);
      return SendResponse.success(feature);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Feature' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Delete(':id')
  async deleteFeature(@Param('id', CustomIntPipe) id: number) {
    try {
      const feature = await this.featureService.deleteFeature(id);
      return SendResponse.success(feature);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete all or selected' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Delete()
  async deleteAll(@Body() body: DeleteOrderDto) {
    try {
      let order;
      if (body.ids && body.ids.length) {
        order = await this.featureService.deleteSelected(body.ids);
      } else {
        order = await this.featureService.deleteAll();
      }
      return SendResponse.success(order);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
}
