import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Exclude()
export class TwofaCodeDto {
  @ApiProperty({ example: '123456' })
  @Expose()
  @IsNotEmpty()
  code: string;
}
