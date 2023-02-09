import {
  applyDecorators,
  HttpCode,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { extend } from 'lodash';
import { ApiErrorResponse } from 'src/schema/api_error_response';
import code from 'src/config/code';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { PermissionsGuard } from 'src/guards/permission.guard';

export function Auth(data?: {
  permissions?: string[];
  roles?: string[];
  loginAdmin?: boolean;
  withoutActive?: boolean;
}) {
  if (!data) data = {};
  data = extend(
    {},
    { permissions: [], roles: [], loginAdmin: false, withoutActive: true },
    data,
  );

  return applyDecorators(
    HttpCode(200),
    SetMetadata('permissions', data.permissions),
    SetMetadata('roles', data.roles),
    SetMetadata('withoutActive', data.withoutActive),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    ApiErrorResponse(code.UNAUTHORIZED),
    ApiErrorResponse(code.BACKEND),
    ApiErrorResponse(code.FORBIDDEN),
  );
}
