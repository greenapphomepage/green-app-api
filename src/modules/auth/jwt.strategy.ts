import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SendResponse } from 'src/utils/send-response';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRESIN },
    });
  }
  async validate(payload) {
    try {
      const user = await this.userService.findUserById(payload.id);
      if (!user) {
        throw new UnauthorizedException(SendResponse.error('UNAUTHORIZED'));
      }
      return user;
    } catch (e) {
      console.log(e);
      return SendResponse.error(e);
    }
  }
}
