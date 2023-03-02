import { Injectable } from '@nestjs/common';
import { MailService } from './utils/mail';

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
        'ilovebossvtt@yandex.com',
        'congthangmyth1802@gmail.com',
      );
      return true;
    } catch (e) {
      console.log(e);
    }
  }
}
