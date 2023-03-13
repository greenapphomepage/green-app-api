import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('mail')
  getHello() {
    return this.appService.testSendMail();
  }
  @Post('table')
  getTable() {
    return this.appService.testTable();
  }
  @Get('format')
  getFormat() {
    return this.appService.testFormat();
  }
}
