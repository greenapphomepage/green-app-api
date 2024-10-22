import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderType } from '../enum/orderType';

export class UpDownDto {
  @ApiProperty({
    type: 'enum',
    example: OrderType.DOWN,
  })
  @IsNotEmpty()
  @IsEnum(OrderType)
  public type: OrderType;
}
