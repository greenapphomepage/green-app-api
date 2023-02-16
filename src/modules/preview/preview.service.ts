import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Previews } from '../../entities/preview';
import { Repository } from 'typeorm';
import { UpdatePreviewDto } from './dto/update.dto';
import { Features } from '../../entities/feature';
import code from '../../config/code';

@Injectable()
export class PreviewService {
  constructor(
    @InjectRepository(Previews)
    private readonly previewRepository: Repository<Previews>,
    @InjectRepository(Features)
    private readonly featureRepository: Repository<Features>,
  ) {}
  async get() {
    try {
      const preview = await this.previewRepository.findOne({
        where: { key: 'preview' },
        select: {
          previewId: true,
          responsive: true,
          platform: true,
          programmingLanguage: true,
          features: {
            featureId: true,
            featureName: true,
            extra: true,
          },
        },
        relations: { features: true },
      });
      preview.responsive = JSON.parse(preview.responsive);
      preview.platform = JSON.parse(preview.platform);
      preview.programmingLanguage = JSON.parse(preview.programmingLanguage);
      preview.features.map((item) => {
        item.extra = JSON.parse(item.extra);
      });
      return preview;
    } catch (e) {
      console.log(e);
    }
  }
  async update(body: UpdatePreviewDto) {
    try {
      const preview = await this.previewRepository.findOne({
        where: { key: 'preview' },
        relations: { features: true },
      });

      if (body.programmingLanguage && body.programmingLanguage.length) {
        await this.previewRepository.update(
          { key: 'preview' },
          { programmingLanguage: JSON.stringify(body.programmingLanguage) },
        );
        // preview.programmingLanguage = JSON.stringify(body.programmingLanguage);
      }
      if (body.responsive && body.responsive.length) {
        await this.previewRepository.update(
          { key: 'preview' },
          { responsive: JSON.stringify(body.responsive) },
        );
        // preview.responsive = JSON.stringify(body.responsive);
      }
      if (body.platform && body.platform.length) {
        await this.previewRepository.update(
          { key: 'preview' },
          { platform: JSON.stringify(body.platform) },
        );
        // preview.platform = JSON.stringify(body.platform);
      }

      if (body.features && body.features.length) {
        const listOldFeaturesID = preview.features.map(
          (item) => item.featureId,
        );
        for (const feature of body.features) {
          const check = await this.featureRepository.findOne({
            where: { featureId: feature },
          });
          if (!check) {
            throw code.FEATURE_NOT_FOUND.type;
          }
          if (listOldFeaturesID.includes(feature)) {
            continue;
          }
          await this.featureRepository.update(
            { featureId: check.featureId },
            { previewId: preview.previewId },
          );
        }
        for (const id of listOldFeaturesID) {
          if (body.features.includes(id)) {
            continue;
          }
          await this.featureRepository.update(
            { featureId: id },
            { previewId: null },
          );
        }
      }
      return await this.previewRepository.findOne({
        where: { key: 'preview' },
        relations: { features: true },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
