import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import code from 'src/config/code';
import { Auth } from 'src/decorator/auth.decorator';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { ApiErrorResponse } from 'src/schema/api_error_response';
import { SendResponse } from 'src/utils/send-response';
import { RegisterUserDTO } from '../user/dto/register.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AddPermissionsRolesDTO } from './dto/add-permission-role.dto';
import { AddPermissionsDTO } from './dto/add-permission.dto';
import { AddRolesDTO } from './dto/add-roles.dto';
import { LoginPostDTO } from './dto/login.dto';
import { GetCurrentUserId } from '../../decorator/getUser';
import { RefreshGuard } from '../../guards/refresh.guard';
import { GetRefreshToken } from '../../decorator/get-refresh-token.decorator';
import { UAParser } from 'ua-parser-js';
import { RefreshToken } from '../../entities/refresh-token';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}
  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @HttpCode(200)
  @ApiErrorResponse(code.USER_EXISTED)
  @ApiErrorResponse(code.BACKEND)
  async Register(@Body() req: RegisterUserDTO) {
    try {
      const newUser = await this.usersService.registerUser(req);
      if (newUser) {
        return SendResponse.success({ msg: 'Done' });
      }
      return SendResponse.error('BACKEND');
    } catch (e) {
      return SendResponse.error(e);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @HttpCode(200)
  @ApiErrorResponse(code.BACKEND)
  @ApiErrorResponse(code.LOGIN_ERROR)
  @ApiErrorResponse(code.WRONG_PASSWORD)
  @ApiErrorResponse(code.USER_NOT_FOUND)
  @ApiErrorResponse(code.USER_UNACTIVED)
  async login(
    @Body() body: LoginPostDTO,
    @Req()
    req: Request,
  ) {
    try {
      const userAgent = UAParser(req.headers['user-agent']);
      const refreshTokenPayload: Pick<
        RefreshToken,
        'userAgent' | 'ip' | 'os' | 'browser'
      > = {
        ip: req.ip,
        userAgent: userAgent.ua,
        browser: userAgent.browser.name,
        os: userAgent.os.name,
      };
      const token = await this.authService.login(body, refreshTokenPayload);
      return SendResponse.success({ token });
    } catch (e) {
      console.log(e);
      return SendResponse.error(e);
    }
  }
  @Post('logout')
  @Auth()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number, @Req() req: Request) {
    try {
      const userAgent = UAParser(req.headers['user-agent']);
      const refreshTokenPayload: Pick<
        RefreshToken,
        'userAgent' | 'ip' | 'os' | 'browser'
      > = {
        ip: req.ip,
        userAgent: userAgent.ua,
        browser: userAgent.browser.name,
        os: userAgent.os.name,
      };
      const res = await this.authService.logout(userId, refreshTokenPayload);
      return SendResponse.success(res);
    } catch (e) {
      console.log(e);
    }
  }

  @UseGuards(RefreshGuard)
  @ApiBearerAuth()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetRefreshToken('refreshToken') refreshToken: string,
    @Req()
    req: Request,
  ) {
    try {
      const userAgent = UAParser(req.headers['user-agent']);
      const refreshTokenPayload: Pick<
        RefreshToken,
        'userAgent' | 'ip' | 'os' | 'browser'
      > = {
        ip: req.ip,
        userAgent: userAgent.ua,
        browser: userAgent.browser.name,
        os: userAgent.os.name,
      };
      const tokens = await this.authService.refreshTokens(
        userId,
        refreshToken,
        refreshTokenPayload,
      );
      return SendResponse.success({ tokens });
    } catch (e) {
      console.log(e);
      return SendResponse.error(e);
    }
  }

  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Add List Roles For One User' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  // @Post('user-roles')
  // async addRolesForUser(@Body() body: AddRolesDTO) {
  //   try {
  //     const result = await this.authService.addRolesForUser(body);
  //     return SendResponse.success(result);
  //   } catch (e) {
  //     return SendResponse.error(e);
  //   }
  // }
  //
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Add List Permission For One User' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  // @Post('user-permissions')
  // async addPermissionForUser(@Body() body: AddPermissionsDTO) {
  //   try {
  //     const result = await this.authService.addPermissionForUser(body);
  //     return SendResponse.success(result);
  //   } catch (e) {
  //     return SendResponse.error(e);
  //   }
  // }
  //
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Add List Permission For One Role' })
  // @Auth({ roles: ['SUPER_ADMIN'] })
  // @Post('role-permissions')
  // async addPermissionForRole(@Body() body: AddPermissionsRolesDTO) {
  //   try {
  //     const result = await this.authService.addPermissionForRole(body);
  //     return SendResponse.success(result);
  //   } catch (e) {
  //     return SendResponse.error(e);
  //   }
  // }
}
