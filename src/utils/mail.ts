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
    email: string,
    receiver_email: string,
  ) {
    await this.mailerService.sendMail({
      to: receiver_email,
      subject: 'Xin chào! Cảm ơn bạn đã tham gia với chúng tôi!',
      template: 'notify_mail',
      context: {
        name: email,
        url: url,
      },
    });
  }
}
