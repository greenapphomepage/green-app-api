import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(
    token: string,
    email: string,
    receiver_email: string,
  ) {
    const url = `${process.env.CLIENT_HOST}/signup/verify?token=${token}`;

    await this.mailerService.sendMail({
      to: receiver_email,
      subject: 'Chào mừng đến với Công Thắng! Xác thực email của bạn',
      template: 'confirmation',
      context: {
        name: email,
        url,
      },
    });
  }

  async sendUserPasswordRecovery(
    password: string,
    email: string,
    receiver_email: string,
  ) {
    await this.mailerService.sendMail({
      to: receiver_email,
      subject: 'Mật khẩu của bạn đã được đổi',
      template: 'recovery',
      context: {
        name: email,
        password: password,
      },
    });
  }

  async sendNotifyMailToCustomer(
    url: string,
    price: number,
    email: string,
    receiver_email: string,
  ) {
    await this.mailerService.sendMail({
      from: email,
      to: receiver_email,
      subject: '[인썸니아] 이승우님을 위한 예상 개발 견적서',
      template: 'notify_mail',
      context: {
        name: email,
        url: url,
        price: price,
      },
    });
  }
}
