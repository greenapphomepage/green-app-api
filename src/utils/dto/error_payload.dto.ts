import { ApiProperty } from '@nestjs/swagger';

export class ErrorPayloadDto {
  @ApiProperty() code: number;
  @ApiProperty() msg: string;
  @ApiProperty({ example: false }) success: boolean;
  @ApiProperty({ example: [] }) errors: object;

  constructor({ code = 500, success = false, msg = '', errors = [] }) {
    this.code = code;
    this.success = success;
    this.msg = msg;
    this.errors = errors;
  }
}
