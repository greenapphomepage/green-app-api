import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

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
    return list;
  }
}
