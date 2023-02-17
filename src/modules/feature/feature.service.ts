import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Features } from '../../entities/feature';
import { Like, Repository } from 'typeorm';
import code from '../../config/code';
import { QueryListDto } from '../../global/dto/query-list.dto';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { Previews } from '../../entities/preview';
import { FileManagerService } from '../../utils/file-manager';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Features)
    private readonly featureRepo: Repository<Features>,
    @InjectRepository(Previews)
    private readonly previewsRepo: Repository<Previews>,
  ) {}

  async createFeature(body: CreateFeatureDto) {
    try {
      const { featureKey, featureName, extra, image } = body;
      const check = await this.featureRepo.findOne({ where: { featureKey } });
      if (check) {
        throw code.FEATURE_EXISTED.type;
      }
      const newFeature = await this.featureRepo.create({
        featureKey,
        featureName,
        extra: JSON.stringify(extra),
      });
      const preview = await this.previewsRepo.findOne({
        where: { key: 'preview' },
      });
      const temp = await this.featureRepo.save({
        ...newFeature,
        preview: { previewId: preview.previewId },
      });

      const getFeature = await this.featureRepo.findOne({
        where: { featureId: temp.featureId },
      });
      if (image) {
        const newImage = FileManagerService.ModuleFileSave(
          getFeature.featureId,
          image,
          'screen',
        );
        getFeature.image = newImage;
      }
      await this.featureRepo.save(getFeature);

      getFeature.extra = JSON.parse(getFeature.extra);
      return getFeature;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async updateFeature(body: UpdateFeatureDto) {
    try {
      const { id, featureName, featureKey, extra, image } = body;
      const checkFeature = await this.featureRepo.findOne({
        where: { featureId: id },
      });
      if (!checkFeature) {
        throw code.FEATURE_NOT_FOUND.type;
      }
      checkFeature.featureName = featureName
        ? featureName
        : checkFeature.featureName;

      checkFeature.image =
        image && !image.includes('screen')
          ? FileManagerService.ModuleFileSave(
              checkFeature.featureId,
              image,
              'screen',
            )
          : checkFeature.image;

      checkFeature.featureKey = featureKey
        ? featureKey
        : checkFeature.featureKey;
      checkFeature.extra = extra ? JSON.stringify(extra) : checkFeature.extra;

      await this.featureRepo.save(checkFeature);
      checkFeature.extra = JSON.parse(checkFeature.extra);
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
      list.map((item) => {
        item.extra = JSON.parse(item.extra);
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
      feature.extra = JSON.parse(feature.extra);
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
      if (feature.image) {
        FileManagerService.RemovePicture(
          feature.featureId,
          feature.image,
          'screen',
        );
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
      FileManagerService.RemovePictureAll('screen');
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
        if (feature.image) {
          FileManagerService.RemovePicture(
            feature.featureId,
            feature.image,
            'screen',
          );
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
