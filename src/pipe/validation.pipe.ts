import {
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe as _ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { UtilsProvider } from 'src/utils/provider';
import code from '../config/code';
import { ErrorPayloadDto } from '../utils/dto/error_payload.dto';

export const ValidationPipe = (options?: ValidationPipeOptions) =>
  new _ValidationPipe({
    ...options,
    exceptionFactory(validationErrors: ValidationError[]) {
      let errors = [];

      errors = UtilsProvider.getErrorList(validationErrors, errors);
      throw new UnprocessableEntityException(
        new ErrorPayloadDto({
          code: code.VALIDATION_ERROR.code,
          success: false,
          msg: 'validation error',
          errors,
        }),
      );
    },
  });
