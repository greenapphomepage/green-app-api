import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { includes, isArray, isEmpty } from 'lodash';
import { SendResponse } from 'src/utils/send-response';
import { UserService } from '../modules/user/user.service';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const userAgent = UAParser(request.headers['user-agent']);

    const user = await UserService.StaticFindUserById(
      request.user.user_id,
      request.ip,
      userAgent.os.name,
      userAgent.browser.name,
      userAgent.ua.slice(0, 7),
    );

    if (!user || user.refreshToken.length === 0)
      throw new HttpException(
        SendResponse.error('FORBIDDEN'),
        HttpStatus.FORBIDDEN,
      );

    if (!user.refreshToken[0].refreshHash) {
      throw new HttpException(
        SendResponse.error('FORBIDDEN'),
        HttpStatus.FORBIDDEN,
      );
    }
    const listPermission = user.permissions.map((o) => o.permission_key);
    const listRole = user.roles.map((o) => o.role_key);

    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        if (!listPermission.includes(permission.permission_key))
          listPermission.push(permission.permission_key);
      });
    });

    if (isEmpty(permissions) && isEmpty(roles)) {
      return true;
    }

    // if (user.codeRoles && includes(user.codeRoles, 'SUPER_ADMIN')) return true

    if (
      !isEmpty(roles) &&
      (!user.roles || !isArray(user.roles) || user.roles.length <= 0)
    )
      throw new HttpException(
        SendResponse.error('FORBIDDEN'),
        HttpStatus.FORBIDDEN,
      );

    if (
      !isEmpty(permissions) &&
      (!listPermission ||
        !isArray(listPermission) ||
        listPermission.length <= 0)
    )
      throw new HttpException(
        SendResponse.error('FORBIDDEN'),
        HttpStatus.FORBIDDEN,
      );

    // for (const role of roles) {
    // 	if (includes(user.codeRoles, role)) return true
    // }

    for (const role of roles) {
      if (includes(listRole, role)) return true;
    }

    for (const permission of permissions) {
      if (includes(listPermission, permission)) return true;
    }
    throw new HttpException(
      SendResponse.error('FORBIDDEN'),
      HttpStatus.FORBIDDEN,
    );
  }
}
