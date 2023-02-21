import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Estimate } from '../../entities/estimate';
import { InjectRepository } from '@nestjs/typeorm';
import code from '../../config/code';
import { CreateEstimateDto } from './dto/create-estimate.dto';
import { UpdateEstimateDto } from './dto/update-estimate.dto';
import { QueryListDto } from '../../global/dto/query-list.dto';

@Injectable()
export class EstimateService {
  constructor(
    @InjectRepository(Estimate)
    private readonly estimateRepo: Repository<Estimate>,
  ) {}
  async createEstimate(body: CreateEstimateDto) {
    try {
      const { nameOption, tag, type, schedule, price } = body;
      const newEstimate = await this.estimateRepo.create({
        nameOption,
        tag,
        type,
        price,
        schedule,
      });
      await this.estimateRepo.save(newEstimate);

      return newEstimate;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async updateEstimate(body: UpdateEstimateDto) {
    try {
      const { id, nameOption, schedule, tag, price, type } = body;
      const checkEstimate = await this.estimateRepo.findOne({
        where: { id },
      });
      if (!checkEstimate) {
        throw code.ESTIMATE_NOT_FOUND.type;
      }
      checkEstimate.nameOption = nameOption
        ? nameOption
        : checkEstimate.nameOption;
      checkEstimate.type = type ? type : checkEstimate.type;
      checkEstimate.tag = tag ? tag : checkEstimate.tag;
      checkEstimate.schedule = schedule ? schedule : checkEstimate.schedule;
      checkEstimate.price = price ? price : checkEstimate.price;

      await this.estimateRepo.save(checkEstimate);
      return checkEstimate;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async listEstimate(query: QueryListDto) {
    try {
      const { keyword, page, perPage, sort } = query;
      const [list, count] = await this.estimateRepo.findAndCount({
        skip: (page - 1) * perPage,
        take: perPage,
        order: { orderId: sort as SORT },
        where: keyword
          ? [
              {
                nameOption: Like(`%${keyword}%`),
              },
              {
                type: Like(`%${keyword}%`),
              },
            ]
          : {},
      });
      return { list, count };
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async detailEstimate(id: number) {
    try {
      const option = await this.estimateRepo.findOne({
        where: { id },
      });
      if (!option) {
        throw code.ESTIMATE_NOT_FOUND.type;
      }
      return option;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async deleteEstimate(id: number) {
    try {
      const option = await this.estimateRepo.findOne({
        where: { id },
      });
      if (!option) {
        throw code.ESTIMATE_NOT_FOUND.type;
      }
      await this.estimateRepo.remove(option);
      return 'Done';
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async deleteAll() {
    try {
      await this.estimateRepo.clear();
      return { msg: 'Done' };
    } catch (e) {
      throw e;
      console.log(e);
    }
  }

  async deleteSelected(ids: number[]) {
    try {
      const listSelected: Estimate[] = [];
      for (const id of ids) {
        const option = await this.estimateRepo.findOne({
          where: { id },
        });
        if (!option) {
          throw code.ESTIMATE_NOT_FOUND.type;
        }

        listSelected.push(option);
      }
      await this.estimateRepo.remove(listSelected);
      return { msg: 'Done' };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
