import code from '../config/code';
import { ErrorPayloadDto } from './dto/error_payload.dto';

export class SendResponse {
  static success(data: any) {
    const result = {
      code: 0,
      success: true,
      data: data,
    };
    return result;
  }

  static error(error: object | string) {
    if (typeof error === 'string') {
      if (code.hasOwnProperty(error)) {
        return new ErrorPayloadDto({
          code: code[error].code,
          success: false,
          msg: error,
        });
      }
    }
    if (typeof error === 'object') {
      let msg = null;
      for (const e in code) {
        if (code[e].code === error['code']) {
          msg = e;
          break;
        }
      }
      return new ErrorPayloadDto({
        code: error['code'],
        success: false,
        msg,
      });
    }
    return new ErrorPayloadDto({
      code: code.BACKEND.code,
      success: false,
      msg: 'BACKEND',
    });
  }

  static message_error(error: object | string) {
    if (typeof error === 'string') {
      if (code.hasOwnProperty(error)) {
        return new ErrorPayloadDto({
          code: code[error].code,
          success: false,
          msg: error,
        });
      }
    }
    if (typeof error === 'object') {
      let msg = null;
      for (const e in code) {
        if (code[e].code === error['code']) {
          msg = e;
          break;
        }
      }
      return new ErrorPayloadDto({
        code: error['code'],
        success: false,
        msg,
      });
    }
    return new ErrorPayloadDto({
      code: code.BACKEND.code,
      success: false,
      msg: 'BACKEND',
    });
  }
}
