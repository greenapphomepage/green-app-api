import { Injectable } from '@nestjs/common';
import { MailService } from './utils/mail';
import * as process from 'process';

@Injectable()
export class AppService {
  constructor(private mailer: MailService) {}
  getHello(): string {
    return 'Hello World!';
  }
  async testSendMail() {
    try {
      await this.mailer.sendNotifyMailToCustomer(
        'test',
        1000,
        process.env.MAIL_USERNAME,
        'congthangmyth1802@gmail.com',
      );
      return true;
    } catch (e) {
      console.log(e);
    }
  }
}
