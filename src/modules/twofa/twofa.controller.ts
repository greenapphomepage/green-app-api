import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UnauthorizedException,
  Request,
  Response,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/decorator/auth.decorator';
import { Users } from 'src/entities/user';
import { UserService } from '../user/user.service';
import { TwofaCodeDto } from './dto/twofa-code.dto';
import { TwoFaStatusUpdateDto } from './dto/twofa-status-update.dto';
import { TwofaService } from './twofa.service';

@ApiTags('TwoFa')
@Controller('twofa')
export class TwofaController {
  constructor(
    private readonly twofaService: TwofaService,
    private readonly usersService: UserService,
  ) {}

  @Post('authenticate')
  @HttpCode(200)
  @Auth()
  async authenticate(
    @Request()
    req,
    @Response()
    response,
    @Body()
    twofaCodeDto: TwofaCodeDto,
  ) {
    const isCodeValid = this.twofaService.isTwoFACodeValid(
      twofaCodeDto.code,
      req.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('invalidOTP');
    }
    const accessToken = await this.usersService.generateAccessToken(
      req.user,
      true,
    );
    const cookiePayload = this.usersService.buildResponsePayload(accessToken);
    response.setHeader('Set-Cookie', cookiePayload);
    return response.status(HttpStatus.NO_CONTENT).json({});
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Auth()
  async toggleTwoFa(
    @Body()
    twofaStatusUpdateDto: TwoFaStatusUpdateDto,
    @Request()
    req,
  ) {
    let qrDataUri = null;
    if (twofaStatusUpdateDto.isTwoFAEnabled) {
      const { otpauthUrl } = await this.twofaService.generateTwoFASecret(
        req.user,
      );
      qrDataUri = await this.twofaService.qrDataToUrl(otpauthUrl);
    }
    return this.usersService.turnOnTwoFactorAuthentication(
      req.user,
      twofaStatusUpdateDto.isTwoFAEnabled,
      qrDataUri,
    );
  }
}
