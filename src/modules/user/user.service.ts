import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import code from 'src/config/code';
import { appDataSource } from 'src/config/datasource';
import { Users } from 'src/entities/user';
import { UtilsProvider } from 'src/utils/provider';
import { SendResponse } from 'src/utils/send-response';
import { Repository } from 'typeorm';
import { RegisterUserDTO } from './dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  async registerUser(user: RegisterUserDTO) {
    try {
      const { user_email, user_password } = user;
      const checkUser = await this.userRepo.findOne({ where: { user_email } });
      if (checkUser) {
        throw SendResponse.error('USER_EXISTED');
      }
      const newUser = await this.userRepo.create({
        user_email,
        user_password: UtilsProvider.generateHash(user_password),
      });
      await this.userRepo.save(newUser);
      return newUser;
    } catch (e) {
      throw e;
    }
  }
  async FindUserByUsername(user_email: string): Promise<Users> {
    return await this.userRepo.findOne({
      where: { user_email: user_email },
      relations: { roles: { permissions: true } },
    });
  }
  static async StaticFindUserById(UserId: number) {
    try {
      const userRepository = appDataSource.getRepository(Users);

      return await userRepository
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.permissions', 'permissions')
        .leftJoinAndSelect('users.refreshToken', 'refreshToken')
        .leftJoinAndSelect('users.roles', 'roles')
        .leftJoinAndSelect('roles.permissions', 'role_permissions')
        .where('users.user_id = :id', { id: UserId })
        .getOne();
    } catch (e) {
      console.log({ e });
    }
  }
  async findUserById(id: number) {
    try {
      return await this.userRepo.findOne({
        select: {
          user_id: true,
          user_email: true,
          roles: true,
          permissions: true,
          twoFAThrottleTime: true,
          twoFASecret: true,
          refreshToken: true,
        },
        where: { user_id: id },
        relations: {
          roles: true,
          permissions: true,
          refreshToken: true,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    const twoFAThrottleTime = new Date();
    twoFAThrottleTime.setSeconds(twoFAThrottleTime.getSeconds() + 60);
    const checkUser = await this.userRepo.findOne({
      where: { user_id: userId },
    });
    if (!checkUser) {
      throw code.USER_NOT_FOUND.type;
    }
    checkUser.twoFASecret = secret;
    checkUser.twoFAThrottleTime = twoFAThrottleTime;
    await this.userRepo.save(checkUser);
  }

  async generateAccessToken(user: Users, isTwoFAAuthenticated = false) {
    try {
      const accessToken = await this.jwtService.signAsync({
        issuer: process.env.SERVER_HOST,
        audience: process.env.CLIENT_HOST,
        subject: String(user.user_id),
        isTwoFAAuthenticated,
      });
      return accessToken;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  buildResponsePayload(accessToken: string, refreshToken?: string): string[] {
    const isSameSite = process.env.IS_SAME_SITE;
    const cookieExpiresIn = +process.env.COOKIE_EXPIRES_IN;
    const expiresIn = +process.env.EXPIRESIN;
    let tokenCookies = [
      `Authentication=${accessToken}; HttpOnly; Path=/; ${
        !isSameSite ? 'SameSite=None; Secure;' : ''
      } Max-Age=${cookieExpiresIn}`,
    ];
    if (refreshToken) {
      const expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + expiresIn);
      tokenCookies = tokenCookies.concat([
        `Refresh=${refreshToken}; HttpOnly; Path=/; ${
          !isSameSite ? 'SameSite=None; Secure;' : ''
        } Max-Age=${cookieExpiresIn}`,
        `ExpiresIn=${expiration}; Path=/; ${
          !isSameSite ? 'SameSite=None; Secure;' : ''
        } Max-Age=${cookieExpiresIn}`,
      ]);
    }
    return tokenCookies;
  }

  async turnOnTwoFactorAuthentication(
    user: Users,
    isTwoFAEnabled = true,
    qrDataUri: string,
  ) {
    if (isTwoFAEnabled) {
      const subject = 'Xác thực 2 yếu tố';
      const mailData = {
        to: user.user_email,
        subject,
        slug: 'two-factor-authentication',
        template: 'twofa',
        context: {
          email: user.user_email,
          qrcode: 'cid:2fa-qrcode',
          username: user.user_email,
          subject,
        },
        attachments: [
          {
            filename: '2fa-qrcode.png',
            path: qrDataUri,
            cid: '2fa-qrcode',
          },
        ],
      };
      await this.mailService.sendMail(mailData);
    }
    const checkUser = await this.userRepo.findOne({
      where: { user_id: user.user_id },
    });
    if (!checkUser) {
      throw code.USER_NOT_FOUND.type;
    }
    checkUser.isTwoFAEnabled = isTwoFAEnabled;
    await this.userRepo.save(checkUser);
    return checkUser;
  }
}
