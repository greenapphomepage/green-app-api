import { Injectable } from '@nestjs/common';
import * as numeral from 'numeral';

@Injectable()
export class FormatNumber {
  static async formatMoney(money: number) {
    return numeral(money).format('0,0');
  }
}
