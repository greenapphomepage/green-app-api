import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorator/auth.decorator';
import { QueryListDto } from 'src/global/dto/query-list.dto';
import { CustomIntPipe } from 'src/pipe/param_validation.pipe';
import { SendResponse } from 'src/utils/send-response';
import { CreateRolesDto } from './dto/create-roles.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { RoleService } from './role.service';

@ApiTags('Roles')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Roles' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Post()
  async createRoles(@Body() body: CreateRolesDto) {
    try {
      const newRoles = await this.roleService.createRoles(body);
      return SendResponse.success(newRoles);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Roles' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Put(':id')
  async updateRoles(
    @Body() body: UpdateRolesDto,
    @Param('id', CustomIntPipe) id: number,
  ) {
    try {
      body.id = id;
      const newRoles = await this.roleService.updateRoles(body);
      return SendResponse.success(newRoles);
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @Get('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List Roles' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  async listRoles(@Query() query: QueryListDto) {
    try {
      query.perPage = !query.perPage ? 10 : query.perPage;
      query.page = !query.page ? 1 : query.page;
      query.sort ? query.sort.toUpperCase() : 'DESC';
      const result = await this.roleService.listRoles(query);
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
  @ApiOperation({ summary: 'Detail Roles' })
  @Auth({ roles: ['SUPER_ADMIN'] })
  @Get(':id')
  async detailRoles(@Param('id', CustomIntPipe) id: number) {
    try {
      const roles = await this.roleService.detailRoles(id);
      return SendResponse.success(roles);
    } catch (e) {
      return SendResponse.error(e);
    }
  }
}
