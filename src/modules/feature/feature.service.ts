import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Features } from '../../entities/feature';
import { Like, Repository } from 'typeorm';
import code from '../../config/code';
import { QueryListDto } from '../../global/dto/query-list.dto';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Features)
    private readonly featureRepo: Repository<Features>,
  ) {}

  async createFeature(body: CreateFeatureDto) {
    try {
      const { featureKey, featureName, extra } = body;
      const newFeature = await this.featureRepo.create({
        featureKey,
        featureName,
        extra: JSON.stringify(extra),
      });
      await this.featureRepo.save(newFeature);

      return newFeature;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async updateFeature(body: UpdateFeatureDto) {
    try {
      const { id, featureName, featureKey, extra } = body;
      const checkFeature = await this.featureRepo.findOne({
        where: { featureId: id },
      });
      if (!checkFeature) {
        throw code.FEATURE_NOT_FOUND.type;
      }
      checkFeature.featureName = featureName
        ? featureName
        : checkFeature.featureName;

      checkFeature.featureKey = featureKey
        ? featureKey
        : checkFeature.featureKey;
      checkFeature.extra = extra ? JSON.stringify(extra) : checkFeature.extra;

      await this.featureRepo.save(checkFeature);
      return checkFeature;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async listFeature(query: QueryListDto) {
    try {
      const { keyword, page, perPage, sort } = query;
      const [list, count] = await this.featureRepo.findAndCount({
        skip: (page - 1) * perPage,
        take: perPage,
        order: { featureId: sort as SORT },
        where: keyword
          ? [
              {
                featureKey: Like(`%${keyword}%`),
              },
              {
                featureName: Like(`%${keyword}%`),
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
  async detailFeature(id: number) {
    try {
      const feature = await this.featureRepo.findOne({
        where: { featureId: id },
      });
      if (!feature) {
        throw code.FEATURE_NOT_FOUND.type;
      }
      return feature;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async deleteFeature(id: number) {
    try {
      const feature = await this.featureRepo.findOne({
        where: { featureId: id },
      });
      if (!feature) {
        throw code.FEATURE_NOT_FOUND.type;
      }
      await this.featureRepo.remove(feature);
      return 'Done';
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async deleteAll() {
    try {
      await this.featureRepo.clear();
      return { msg: 'Done' };
    } catch (e) {
      throw e;
      console.log(e);
    }
  }

  async deleteSelected(ids: number[]) {
    try {
      const listSelected: Features[] = [];
      for (const id of ids) {
        const feature = await this.featureRepo.findOne({
          where: { featureId: id },
        });
        if (!feature) {
          throw code.FEATURE_NOT_FOUND.type;
        }
        listSelected.push(feature);
      }
      await this.featureRepo.remove(listSelected);
      return { msg: 'Done' };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
