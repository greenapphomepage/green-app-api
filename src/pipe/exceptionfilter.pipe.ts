import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  UnprocessableEntityException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SendResponse } from 'src/utils/send-response';

// @Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = 200;

    try {
      response
        .status(status)
        .json(
          exception.getResponse && exception.getResponse()
            ? exception.getResponse()
            : SendResponse.error(exception.toString().toUpperCase()),
        );
    } catch {
      response.status(status).json(SendResponse.error('NOT_FOUND'));
    }
  }
}
