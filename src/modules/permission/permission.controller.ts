import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorator/auth.decorator';
import { QueryListDto } from 'src/global/dto/query-list.dto';
import { CustomIntPipe } from 'src/pipe/param_validation.pipe';
import { SendResponse } from 'src/utils/send-response';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionService } from './permission.service';

@ApiTags('Permissions')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Permission' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Post()
  async createRoles(@Body() body: CreatePermissionDto) {
    try {
      const newRoles = await this.permissionService.createPermissions(body);
      return SendResponse.success(newRoles);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Permission' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Put(':id')
  async updateRoles(
    @Body() body: UpdatePermissionDto,
    @Param('id', CustomIntPipe) id: number,
  ) {
    try {
      body.id = id;
      const newRoles = await this.permissionService.updatePermissions(body);
      return SendResponse.success(newRoles);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @Get('')
  @ApiOperation({ summary: 'List Permission' })
  @ApiBearerAuth()
  @Auth({ roles: ['SUPER_ADMIN'] })
  async listRoles(@Query() query: QueryListDto) {
    try {
      query.perPage = !query.perPage ? 10 : query.perPage;
      query.page = !query.page ? 1 : query.page;
      query.sort ? query.sort.toUpperCase() : 'DESC';
      const result = await this.permissionService.listPermissions(query);
      const pagi = (result.count / query.perPage) | 0;
      const pages = result.count % query.perPage == 0 ? pagi : pagi + 1;
      const page = +query.page;
      const total = result.count;
      return SendResponse.success({
        page,
        pages,
        total,
        listRoles: result.list,
      });
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detail Permission' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Get(':id')
  async detailRoles(@Param('id', CustomIntPipe) id: number) {
    try {
      const roles = await this.permissionService.detailPermissions(id);
      return SendResponse.success(roles);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
}
