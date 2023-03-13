import { Injectable } from '@nestjs/common';
import { MailService } from './utils/mail';
import * as process from 'process';
import { CreateTable } from './utils/table';
import { FormatNumber } from './utils/numeral';

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

  async testTable() {
    try {
      const list = [
        {
          type: '반응형웹',
          nameOption:
            'PC와 모바일 브라우져에 대략적인 대응, 인터넷 익스플로러 는 대응하 지 않습니다',
          price: 2000,
        },
      ];
      await CreateTable.create(list, 550000, 'test');
      return true;
    } catch (e) {
      console.log(e);
    }
  }

  async testFormat() {
    try {
      return await FormatNumber.formatMoney(6000000000);
    } catch (e) {
      console.log(e);
    }
  }
}
