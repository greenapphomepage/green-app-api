import { Injectable } from '@nestjs/common';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { OrderProject } from '../../entities/order-project';
import { InjectRepository } from '@nestjs/typeorm';
import { FileManagerService } from '../../utils/file-manager';
import code from '../../config/code';
import { QueryListDto } from '../../global/dto/query-list.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { MailService } from '../../utils/mail';
import * as process from 'process';
import { CreateTable } from '../../utils/table';

@Injectable()
export class OrderProjectService {
  constructor(
    @InjectRepository(OrderProject)
    private readonly orderRepo: Repository<OrderProject>,

    private readonly mailer: MailService,
  ) {}

  async createOrder(body: CreateOrderDto) {
    try {
      const {
        description,
        governmentSupport,
        customerName,
        projectName,
        companyName,
        maximumBudget,
        phone,
        platform,
        planFile,
        position,
        presenter,
        email,
        estimatedCost,
        options,
      } = body;
      const newOrder = await this.orderRepo.create({
        description,
        governmentSupport,
        customerName,
        projectName,
        companyName,
        maximumBudget,
        phone,
        platform,
        position,
        email,
        presenter,
        estimatedCost,
        options: options && options.length ? JSON.stringify(options) : null,
      });
      await this.orderRepo.save(newOrder);
      if (newOrder) {
        const getOrder = await this.orderRepo.findOne({
          where: { orderId: newOrder.orderId },
        });
        if (planFile && planFile.length) {
          const newFiles = FileManagerService.ModuleListFileSave(
            getOrder.orderId,
            planFile,
            'plan',
          );
          getOrder.planFile = JSON.stringify(newFiles);
        }
        await this.orderRepo.save(getOrder);
        getOrder.planFile = JSON.parse(getOrder.planFile);
        getOrder.options = JSON.parse(getOrder.options);
        await CreateTable.create(
          options,
          getOrder.estimatedCost,
          `table${getOrder.orderId}`,
          getOrder.platform,
        );
       try {
         await this.mailer.sendNotifyMailToCustomer(
             `${process.env.SERVER_HOST}/table/table${getOrder.orderId}.pdf`,
             getOrder.estimatedCost,
             process.env.MAIL_USERNAME,
             getOrder.email,
         );
       }
       catch (e) {
       }
        return getOrder;
      }
      return null;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async updateOrder(body: UpdateOrderDto) {
    try {
      const { id, isDone } = body;
      const checkOrder = await this.orderRepo.findOne({
        where: { orderId: id },
      });
      if (!checkOrder) {
        throw code.ORDER_NOT_FOUND.type;
      }
      checkOrder.isDone = isDone === true ? isDone : checkOrder.isDone;

      await this.orderRepo.save(checkOrder);
      return checkOrder;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async listOrder(query: QueryListDto) {
    try {
      const { keyword, page, perPage, sort } = query;
      const [list, count] = await this.orderRepo.findAndCount({
        skip: (page - 1) * perPage,
        take: perPage,
        order: { orderId: sort as SORT },
        where: keyword
          ? [
              {
                projectName: Like(`%${keyword}%`),
              },
              {
                companyName: Like(`%${keyword}%`),
              },
            ]
          : {},
      });
      list.forEach((item) => {
        item.options = JSON.parse(item.options);
        item.planFile = JSON.parse(item.planFile);
      });
      return { list, count };
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async detailOrder(id: number) {
    try {
      const order = await this.orderRepo.findOne({
        where: { orderId: id },
      });
      if (!order) {
        throw code.ORDER_NOT_FOUND.type;
      }
      order.options = JSON.parse(order.options);
      order.planFile = JSON.parse(order.planFile);
      return order;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async deleteOrder(id: number) {
    try {
      const order = await this.orderRepo.findOne({
        where: { orderId: id },
      });
      if (!order) {
        throw code.ORDER_NOT_FOUND.type;
      }
      if (order.planFile) {
        JSON.parse(order.planFile).forEach((file) => {
          FileManagerService.RemovePicture(order.orderId, file, 'plan');
        });
      }
      await this.orderRepo.remove(order);
      return 'Done';
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async deleteAll() {
    try {
      await this.orderRepo.clear();
      FileManagerService.RemovePictureAll('plan');
      return { msg: 'Done' };
    } catch (e) {
      throw e;
      console.log(e);
    }
  }

  async deleteSelected(ids: number[]) {
    try {
      const listSelected: OrderProject[] = [];
      for (const id of ids) {
        const order = await this.orderRepo.findOne({
          where: { orderId: id },
        });
        if (!order) {
          throw code.ORDER_NOT_FOUND.type;
        }
        if (order.planFile) {
          JSON.parse(order.planFile).forEach((file) => {
            FileManagerService.RemovePicture(order.orderId, file, 'plan');
          });
        }
        listSelected.push(order);
      }
      await this.orderRepo.remove(listSelected);
      return { msg: 'Done' };
    } catch (e) {
      throw e;
      console.log(e);
    }
  }

  async updateOptionByType(olderType, newType): Promise<void> {
    try {
      const orders = await this.orderRepo.find({
        where: { options: Not(IsNull()) },
      });
      for (const order of orders) {
        const options: Array<{
          type: string;
          nameOption: string;
          price: number;
        }> = JSON.parse(order.options);
        options.forEach((item) => {
          if (item.type === olderType) {
            item.type = newType;
          }
        });
        await this.orderRepo.update(
          { orderId: order.orderId },
          { options: JSON.stringify(options) },
        );
      }
    } catch (e) {
      throw e;
    }
  }
}
