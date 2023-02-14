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
import { OrderProjectService } from './order-project.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorator/auth.decorator';
import { SendResponse } from '../../utils/send-response';
import { CustomIntPipe } from '../../pipe/param_validation.pipe';
import { QueryListDto } from '../../global/dto/query-list.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DeleteOrderDto } from './dto/delete-order.dto';

@ApiTags('OrderProject')
@Controller('order-project')
export class OrderProjectController {
  constructor(private readonly orderProjectService: OrderProjectService) {}

  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Order' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  @Post()
  async createOrder(@Body() body: CreateOrderDto) {
    try {
      const newOrder = await this.orderProjectService.createOrder(body);
      return SendResponse.success(newOrder);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Order' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Put(':id')
  async updateOrder(
    @Body() body: UpdateOrderDto,
    @Param('id', CustomIntPipe) id: number,
  ) {
    try {
      body.id = id;
      const newOrder = await this.orderProjectService.updateOrder(body);
      return SendResponse.success(newOrder);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @Get('')
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'List Order' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  async listOrder(@Query() query: QueryListDto) {
    try {
      query.perPage = !query.perPage ? 10 : query.perPage;
      query.page = !query.page ? 1 : query.page;
      query.sort ? query.sort.toUpperCase() : 'DESC';
      const result = await this.orderProjectService.listOrder(query);
      const pagi = (result.count / query.perPage) | 0;
      const pages = result.count % query.perPage == 0 ? pagi : pagi + 1;
      const page = +query.page;
      const total = result.count;
      return SendResponse.success({
        page,
        pages,
        total,
        listOrder: result.list,
      });
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Detail Order' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  @Get(':id')
  async detailOrder(@Param('id', CustomIntPipe) id: number) {
    try {
      const order = await this.orderProjectService.detailOrder(id);
      return SendResponse.success(order);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Order' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Delete(':id')
  async deleteOrder(@Param('id', CustomIntPipe) id: number) {
    try {
      const order = await this.orderProjectService.deleteOrder(id);
      return SendResponse.success(order);
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
        order = await this.orderProjectService.deleteSelected(body.ids);
      } else {
        order = await this.orderProjectService.deleteAll();
      }
      return SendResponse.success(order);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
}
