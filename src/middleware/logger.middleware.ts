import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../modules/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private myLogger: LoggerService) {}

  use(req: Request, res: Response, next: any) {
    const { headers, method, baseUrl, query, body, socket } = req;
    let ip = headers['x-forwarded-for'] || socket.remoteAddress;
    if (Array.isArray(ip)) {
      ip = ip[0];
    }
    this.myLogger.log(
      {
        time: new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        baseUrl,
        ip,
        query,
        body,
      },
      `${method}`,
    );
    next();
  }
}
