import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Portfolios } from '../../entities/portfolio';
import { InjectRepository } from '@nestjs/typeorm';
import code from '../../config/code';
import { QueryListDto } from '../../global/dto/query-list.dto';
import { CreatePortfoliosDto } from './dto/create-portfolio.dto';
import { UpdatePortfoliosDto } from './dto/update-portfolio.dto';
import { FileManagerService } from '../../utils/file-manager';
import {filterListTagV2Dto} from "../tag/dto/filter-tag.dto";

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolios)
    private readonly portfolioRepo: Repository<Portfolios>,
  ) {}

  async createPortfolios(body: CreatePortfoliosDto) {
    try {
      const { logo, programming_language, description, title, images } = body;
      const newPortfolios = await this.portfolioRepo.create({
        programming_language,
        title,
        description,
      });
      await this.portfolioRepo.save(newPortfolios);
      if (newPortfolios) {
        const getPortfolio = await this.portfolioRepo.findOne({
          where: { portfolio_id: newPortfolios.portfolio_id },
        });
        if (logo) {
          const newLogo = FileManagerService.ModuleFileSave(
            getPortfolio.portfolio_id,
            logo,
            'logo',
          );
          getPortfolio.logo = newLogo;
        }
        if (images && images.length) {
          const newImage = FileManagerService.ModuleListFileSave(
            getPortfolio.portfolio_id,
            images,
            'images',
          );
          getPortfolio.images = JSON.stringify(newImage);
        }
        await this.portfolioRepo.save(getPortfolio);
        getPortfolio.images = JSON.parse(getPortfolio.images);
        return getPortfolio;
      }
      return null;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async updatePortfolios(body: UpdatePortfoliosDto) {
    try {
      const { id, logo, programming_language, description, title, images } =
        body;
      const checkPortfolios = await this.portfolioRepo.findOne({
        where: { portfolio_id: id },
      });
      if (!checkPortfolios) {
        throw code.PORTFOLIO_NOT_FOUND.type;
      }

      checkPortfolios.title = title ? title : checkPortfolios.title;

      checkPortfolios.description = description
        ? description
        : checkPortfolios.description;

      checkPortfolios.programming_language = programming_language
        ? programming_language
        : checkPortfolios.programming_language;

      checkPortfolios.logo =
        logo && !logo.includes('logo')
          ? FileManagerService.ModuleFileSave(
              checkPortfolios.portfolio_id,
              logo,
              'logo',
            )
          : checkPortfolios.logo;
      if (images && images.length) {
        const listImage: string[] = [];
        for (const image of images) {
          if (image.includes('images')) {
            listImage.push(image);
          } else {
            const tmpImage = FileManagerService.ModuleFileSave(
              checkPortfolios.portfolio_id,
              image,
              'images',
            );
            listImage.push(tmpImage);
          }
        }
        // const newImage = FileManagerService.ModuleListFileSave(
        //   checkPortfolios.portfolio_id,
        //   images,
        //   'images',
        // );
        checkPortfolios.images = JSON.stringify(listImage);
      }
      await this.portfolioRepo.save(checkPortfolios);
      checkPortfolios.images = JSON.parse(checkPortfolios.images);
      return checkPortfolios;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async listPortfolios(query: QueryListDto) {
    try {
      const { keyword, page, perPage, sort } = query;
      const [list, count] = await this.portfolioRepo.findAndCount({
        skip: (page - 1) * perPage,
        take: perPage,
        order: { portfolio_id: sort as SORT },
        where: keyword
          ? [
              {
                title: Like(`%${keyword}%`),
              },
              {
                programming_language: Like(`%${keyword}%`),
              },
            ]
          : {},
      });
      list.forEach((item) => {
        item.images = JSON.parse(item.images);
      });
      return { list, count };
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async detailPortfolios(id: number) {
    try {
      const portfolio = await this.portfolioRepo.findOne({
        where: { portfolio_id: id },
      });
      if (!portfolio) {
        throw code.PORTFOLIO_NOT_FOUND.type;
      }
      portfolio.images = JSON.parse(portfolio.images);
      return portfolio;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async getListImages(id: number) {
    try {
      return FileManagerService.getImagesFromFolder('images', id);
    } catch (e) {
      console.log(e);
    }
  }
  async deletePortfolios(id: number) {
    try {
      const portfolio = await this.portfolioRepo.findOne({
        where: { portfolio_id: id },
      });
      if (!portfolio) {
        throw code.PORTFOLIO_NOT_FOUND.type;
      }
      if (portfolio.logo) {
        FileManagerService.RemovePicture(
          portfolio.portfolio_id,
          portfolio.logo,
          'logo',
        );
      }
      if (portfolio.images) {
        JSON.parse(portfolio.images).forEach((image) => {
          FileManagerService.RemovePicture(
            portfolio.portfolio_id,
            image,
            'images',
          );
        });
      }

      await this.portfolioRepo.remove(portfolio);
      return 'Done';
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async deleteAll() {
    try {
      await this.portfolioRepo.clear();
      FileManagerService.RemovePictureAll('images');
      FileManagerService.RemovePictureAll('logo');
      return { msg: 'Done' };
    } catch (e) {
      throw e;
      console.log(e);
    }
  }

  async deleteSelected(ids: number[]) {
    try {
      const listSelected = [];
      for (const id of ids) {
        const portfolio = await this.portfolioRepo.findOne({
          where: { portfolio_id: id },
        });
        if (!portfolio) {
          throw code.PORTFOLIO_NOT_FOUND.type;
        }
        if (portfolio.logo) {
          FileManagerService.RemovePicture(
            portfolio.portfolio_id,
            portfolio.logo,
            'logo',
          );
        }
        if (portfolio.images) {
          JSON.parse(portfolio.images).forEach((image) => {
            FileManagerService.RemovePicture(
              portfolio.portfolio_id,
              image,
              'images',
            );
          });
        }
        listSelected.push(portfolio);
      }
      await this.portfolioRepo.remove(listSelected);
      return { msg: 'Done' };
    } catch (e) {
      throw e;
      console.log(e);
    }
  }
  async list(){
    const list = await this.portfolioRepo.find()
    list.forEach((item) => {
      item.images = JSON.parse(item.images);
    });
    return list
  }
}
