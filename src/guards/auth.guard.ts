import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SendResponse } from 'src/utils/send-response';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    const request = context.switchToHttp().getRequest();
    const { headers, socket } = request;
    let ip = headers['x-forwarded-for'] || socket.remoteAddress;
    if (Array.isArray(ip)) {
      ip = ip[0];
    }
    if (!user || user.refreshToken.length === 0) {
      throw new UnauthorizedException(SendResponse.error('UNAUTHORIZED'));
    }
    const listIpAccess: Array<string> = user.refreshToken.map(
      (item) => item.ip,
    );
    if (!listIpAccess.includes(ip)) {
      throw new UnauthorizedException(SendResponse.error('UNAUTHORIZED'));
    }
    return super.handleRequest(err, user, info, context, status);
  }
}
