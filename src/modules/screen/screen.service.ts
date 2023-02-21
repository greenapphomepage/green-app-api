import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Screens } from '../../entities/screen';
import { InjectRepository } from '@nestjs/typeorm';
import code from '../../config/code';
import { FileManagerService } from '../../utils/file-manager';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { FilterListScreenDto } from './dto/filter-list-screen.dto';

@Injectable()
export class ScreenService {
  constructor(
    @InjectRepository(Screens)
    private readonly screenRepo: Repository<Screens>,
  ) {}

  async createOption(body: CreateScreenDto) {
    try {
      let index: number;
      const list = await this.screenRepo.find({ order: { id: 'DESC' } });
      if (!list.length) {
        index = 1000;
      } else {
        index = list[0].index - 1;
      }
      const { nameOption, tag, type, image, schedule, price } = body;
      const newOption = await this.screenRepo.create({
        nameOption,
        tag,
        type,
        price,
        schedule,
        index,
      });
      const temp = await this.screenRepo.save(newOption);

      const getOption = await this.screenRepo.findOne({
        where: { id: temp.id },
      });
      if (image) {
        getOption.image = FileManagerService.ModuleFileSave(
          getOption.id,
          image,
          'screen',
        );
      }
      await this.screenRepo.save(getOption);

      return getOption;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async updateOption(body: UpdateScreenDto) {
    try {
      const { id, nameOption, schedule, tag, price, type, image } = body;
      const checkOption = await this.screenRepo.findOne({
        where: { id },
      });
      if (!checkOption) {
        throw code.OPTION_NOT_FOUND.type;
      }
      checkOption.nameOption = nameOption ? nameOption : checkOption.nameOption;

      checkOption.image =
        image && !image.includes('screen')
          ? FileManagerService.ModuleFileSave(checkOption.id, image, 'screen')
          : checkOption.image;

      checkOption.type = type ? type : checkOption.type;
      checkOption.tag = tag ? tag : checkOption.tag;
      checkOption.schedule = schedule ? schedule : checkOption.schedule;
      checkOption.price = price ? price : checkOption.price;

      await this.screenRepo.save(checkOption);
      return checkOption;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async listOption(query: FilterListScreenDto) {
    try {
      const { keyword, page, perPage, sort, type, tag } = query;
      const [list, count] = await this.screenRepo.findAndCount({
        skip: (page - 1) * perPage,
        take: perPage,
        order: { index: sort as SORT },
        where: {
          ...(tag ? { tag } : {}),
          ...(type ? { type } : {}),
          ...(keyword ? { nameOption: Like(`%${keyword}%`) } : {}),
        },
      });
      return { list, count };
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async detailOption(id: number) {
    try {
      const option = await this.screenRepo.findOne({
        where: { id },
      });
      if (!option) {
        throw code.OPTION_NOT_FOUND.type;
      }
      return option;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async deleteOption(id: number) {
    try {
      const option = await this.screenRepo.findOne({
        where: { id },
      });
      if (!option) {
        throw code.OPTION_NOT_FOUND.type;
      }
      if (option.image) {
        FileManagerService.RemovePicture(option.id, option.image, 'screen');
      }
      await this.screenRepo.remove(option);
      return 'Done';
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async deleteAll() {
    try {
      await this.screenRepo.clear();
      FileManagerService.RemovePictureAll('screen');
      return { msg: 'Done' };
    } catch (e) {
      throw e;
      console.log(e);
    }
  }

  async deleteSelected(ids: number[]) {
    try {
      const listSelected: Screens[] = [];
      for (const id of ids) {
        const option = await this.screenRepo.findOne({
          where: { id },
        });
        if (!option) {
          throw code.OPTION_NOT_FOUND.type;
        }
        if (option.image) {
          FileManagerService.RemovePicture(option.id, option.image, 'screen');
        }
        listSelected.push(option);
      }
      await this.screenRepo.remove(listSelected);
      return { msg: 'Done' };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async upDown(id: number, type: 'UP' | 'DOWN') {
    try {
      const checkOption = await this.screenRepo.findOne({
        where: { id },
      });
      if (!checkOption) {
        throw code.OPTION_NOT_FOUND.type;
      }
      const list = await this.screenRepo.find({ order: { index: 'DESC' } });
      const pos = list.map((item) => item.id).indexOf(checkOption.id);
      if (type === 'UP') {
        if (pos === 0) {
          throw code.CAN_NOT_UP.type;
        }
        await this.screenRepo.update(
          { id: list[pos - 1].id },
          { index: list[pos - 1].index - 1 },
        );
        checkOption.index = checkOption.index + 1;
      } else {
        if (pos === list.length - 1) {
          throw code.CAN_NOT_DOWN.type;
        }
        await this.screenRepo.update(
          { id: list[pos + 1].id },
          { index: list[pos + 1].index + 1 },
        );
        checkOption.index = checkOption.index - 1;
      }
      await this.screenRepo.save(checkOption);
      return { msg: 'Done' };
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
}
