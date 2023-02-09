import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SendResponse } from 'src/utils/send-response';

@Injectable()
export class RefreshGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (!user) {
      throw new UnauthorizedException(SendResponse.error('UNAUTHORIZED'));
    }
    return super.handleRequest(err, user, info, context, status);
  }
}
