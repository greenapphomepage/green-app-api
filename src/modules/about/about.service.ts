import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import {orderBy} from 'lodash';

@Injectable()
export class AboutService {
  constructor(
  ) {}
  async getImages () {
    const list = [];
    const manage_folder = `public/about`;
    const files = fs.readdirSync(manage_folder);
    for (const file of files) {

        list.push(`about/${file}`);

    }
    return orderBy(list,[function (o : string) { return Number(o.split('/')[1].split('.')[0]) }],['asc']);
  }
}
