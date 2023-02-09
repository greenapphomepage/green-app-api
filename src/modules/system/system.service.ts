import { Injectable } from '@nestjs/common';
import { UtilsProvider } from 'src/utils/provider';
import config from 'src/config/config';
import { FileManagerService } from '../../utils/file-manager';
@Injectable()
export class SystemService {
  constructor() {}
  async SavePicture(folder: string, file: Express.Multer.File) {
    try {
      const filename = UtilsProvider.randomString(
        config.RANDOM_STRING_LENGTH.value,
      );
      const check = FileManagerService.LocalSavePicture('tmp', file, filename);
      if (check) {
        return check;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
