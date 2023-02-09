import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream, toDataURL } from 'qrcode';

import code from 'src/config/code';
import { Users } from 'src/entities/user';
import { UserService } from '../user/user.service';

const authenticationAppNAme = process.env.APP_NAME;

@Injectable()
export class TwofaService {
  constructor(private readonly usersService: UserService) {}

  async generateTwoFASecret(user: Users) {
    if (user.twoFAThrottleTime > new Date()) {
      throw `tooManyRequest-{"second":"${this.differentBetweenDatesInSec(
        user.twoFAThrottleTime,
        new Date(),
      )}"}`;
    }
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.user_email,
      authenticationAppNAme,
      secret,
    );
    await this.usersService.setTwoFactorAuthenticationSecret(
      secret,
      user.user_id,
    );
    return {
      secret,
      otpauthUrl,
    };
  }

  isTwoFACodeValid(twoFASecret: string, user: Users) {
    return authenticator.verify({
      token: twoFASecret,
      secret: user.twoFASecret,
    });
  }

  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  async qrDataToUrl(otpauthUrl: string): Promise<string> {
    return toDataURL(otpauthUrl);
  }

  differentBetweenDatesInSec(initialDate: Date, endDate: Date): number {
    const diffInSeconds = Math.abs(initialDate.getTime() - endDate.getTime());
    return Math.round(diffInSeconds / 1000);
  }
}
