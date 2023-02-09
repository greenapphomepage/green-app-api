import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetRefreshToken = createParamDecorator(
  (data: any, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!data) return user;
    return user[data];
  },
);
