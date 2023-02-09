import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { OrderProject } from '../../entities/order-project';
import { InjectRepository } from '@nestjs/typeorm';
import { FileManagerService } from '../../utils/file-manager';
import code from '../../config/code';
import { QueryListDto } from '../../global/dto/query-list.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderProjectService {
  constructor(
    @InjectRepository(OrderProject)
    private readonly orderRepo: Repository<OrderProject>,
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
        email,
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
      });
      await this.orderRepo.save(newOrder);
      if (planFile) {
        const newPlan = FileManagerService.ModuleFileSave(
          newOrder.orderId,
          planFile,
          'plan',
        );
        newOrder.planFile = newPlan;
        await this.orderRepo.save(newOrder);
      }
      return newOrder;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async updateOrder(body: UpdateOrderDto) {
    try {
      const { id, estimatedTime, estimatedCost, isDone } = body;
      const checkOrder = await this.orderRepo.findOne({
        where: { orderId: id },
      });
      if (!checkOrder) {
        throw code.ORDER_NOT_FOUND.type;
      }
      checkOrder.estimatedTime = estimatedTime
        ? estimatedTime
        : checkOrder.estimatedTime;

      checkOrder.estimatedCost = estimatedCost
        ? estimatedCost
        : checkOrder.estimatedCost;
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
      return { list, count };
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async detailOrder(id: number) {
    try {
      const portfolio = await this.orderRepo.findOne({
        where: { orderId: id },
      });
      if (!portfolio) {
        throw code.ORDER_NOT_FOUND.type;
      }
      return portfolio;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
  async deleteOrder(id: number) {
    try {
      const portfolio = await this.orderRepo.findOne({
        where: { orderId: id },
      });
      if (!portfolio) {
        throw code.ORDER_NOT_FOUND.type;
      }
      await this.orderRepo.remove(portfolio);
      return 'Done';
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }
}
