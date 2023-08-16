import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { join } from 'path';
import * as fs from 'fs';
import config from 'src/config/config';
import { UtilsProvider } from './provider';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class FileManagerService {
  constructor() {}

  // @Cron(CronExpression.EVERY_MINUTE)
  async removePictureByTime() {
    try {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      const manage_folder = `public/${config.TMP_FOLDER.value}`;
      let counter = 0;
      while (true) {
        if (counter == config.TMP_RELOAD_CHECKER.value) {
          counter = 0;
          fs.readdirSync(manage_folder).forEach((file) => {
            try {
              const stats = fs.statSync(join(manage_folder, file));
              const get_now = new Date();
              const diffTime = Math.abs(
                (get_now.getTime() - stats.birthtime.getTime()) / 1000,
              );
              if (diffTime > config.TMP_FILE_MAX.value) {
                console.log('remove ' + join(manage_folder, file));
                fs.unlinkSync(join(manage_folder, file));
              }
            } catch (e) {
              console.log(e);
            }
          });
        } else {
          counter++;
        }
        await delay(1000);
      }
    } catch (e) {
      console.log(e);
    }
  }

  static ModuleFileSave(id: number, request_file: string, folder: string) {
    if (!request_file) {
      return null;
    }

    const checkFile = FileManagerService.findFileById(folder, id);
    // var get_tmp_file = user.avatar.substring(user.avatar.lastIndexOf('/') + 1);

    request_file = join(`public/tmp/`, path.basename(request_file));
    if (!fs.existsSync(request_file)) {
      throw 'PICTURE_ERROR';
    }
    const new_file_name = `public/${folder}/${id}_${+new Date()}_${UtilsProvider.randomNumber(
      10,
    )}${path.extname(request_file)}`;
    if (checkFile) {
      fs.unlinkSync(checkFile);
      fs.renameSync(request_file, new_file_name);
    } else {
      fs.renameSync(request_file, new_file_name);
    }
    return new_file_name.replace('public/', '');
  }

  static findFileById(folder: string, id: number) {
    const manage_folder = `public/${folder}`;

    const list_files = fs.readdirSync(manage_folder);
    for (const file of list_files) {
      const id_file = file.split('_');
      if (id == parseInt(id_file[0])) {
        return join(manage_folder, file);
      }
    }
    return null;
  }

  static findListFileById(folder: string, id: number) {
    const manage_folder = `public/${folder}`;

    const list_files = fs.readdirSync(manage_folder);
    console.log({ list_files });
    const listResult: Array<string> = [];
    for (const file of list_files) {
      const id_file = file.split('_');
      if (id == parseInt(id_file[0])) {
        listResult.push(join(manage_folder, file));
      }
    }
    return listResult;
  }

  static ModuleListFileSave(
    id: number,
    request_file: Array<string>,
    folder: string,
  ) {
    const checkListFile = FileManagerService.findListFileById(folder, id);
    console.log({ checkListFile });
    if (checkListFile.length > 0) {
      for (const file of checkListFile) {
        fs.unlinkSync(file);
      }
    }
    const listResult: Array<string> = [];
    console.log({ request_file });
    for (const item of request_file) {
      const check = join(`public/tmp/`, path.basename(item));
      if (!fs.existsSync(check)) {
        throw 'FILE_ERROR';
      }
      const new_file_name = `public/${folder}/${id}_${+new Date()}_${UtilsProvider.randomNumber(
        10,
      )}${path.extname(item)}`;
      fs.renameSync(check, new_file_name);
      listResult.push(new_file_name.replace('public/', ''));
    }
    return listResult;
  }

  static LocalSavePicture(
    folder: string,
    file: Express.Multer.File,
    filename: string,
  ) {
    try {
      const public_folder = `public/${folder}`;
      // const extArray = file.mimetype.split('/');
      const savePicture = join(
        public_folder,
        `${filename}${path.extname(file.originalname)}`,
      );
      fs.writeFileSync(savePicture, file.buffer);
      while (!fs.existsSync(savePicture)) {}
      return `${filename}${path.extname(file.originalname)}`;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  static RemovePicture(id: number, request_file: string, folder: string) {
    try {
      if (!request_file) {
        return null;
      }
      const checkFile = join(`public/${folder}`, path.basename(request_file));
      if (!fs.existsSync(checkFile)) {
        throw 'PICTURE_ERROR';
      }
      fs.unlinkSync(checkFile);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  static RemovePictureAll(folder: string) {
    try {
      const manage_folder = `public/${folder}`;
      const list_files = fs.readdirSync(manage_folder);
      for (const file of list_files) {
        fs.unlinkSync(file);
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  static getImagesFromFolder(folder: string, id: number) {
    try {
      const list = [];
      const manage_folder = `public/${folder}`;
      const files = fs.readdirSync(manage_folder);
      for (const file of files) {
        const id_file = file.split('_');
        if (id == parseInt(id_file[0])) {
          list.push(`public/${file}`);
        }
      }
      return list;
    } catch (e) {
      console.log(e);
    }
  }
}
