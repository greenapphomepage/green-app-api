import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { SendResponse } from 'src/utils/send-response';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      signOptions: { expiresIn: process.env.REFRESH_EXPIRESIN },
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload) {
    try {
      const refreshToken = req
        ?.get('authorization')
        ?.replace('Bearer', '')
        .trim();
      if (!refreshToken)
        throw new ForbiddenException(SendResponse.error('FORBIDDEN'));
      return {
        ...payload,
        refreshToken,
      };
    } catch (e) {
      console.log(e);
      return SendResponse.error(e);
    }
  }
}
