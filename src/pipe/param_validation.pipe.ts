import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadGatewayException,
} from '@nestjs/common';
import { SendResponse } from 'src/utils/send-response';

@Injectable()
export class CustomIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const check = Number(value);
      if (!check) {
        throw new BadGatewayException(SendResponse.error('ID_FORMAT'));
      }
      return check;
    } catch {
      throw new BadGatewayException(SendResponse.error('ID_FORMAT'));
    }
  }
}
