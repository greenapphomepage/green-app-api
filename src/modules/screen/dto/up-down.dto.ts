import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';

enum upDown {
  UP = 'UP',
  DOWN = 'DOWN',
}

@Exclude()
export class UpDownDto {
  @ApiProperty({ type: 'string', example: 'UP | DOWN' })
  @Expose()
  @IsNotEmpty()
  @IsEnum(upDown)
  type: 'UP' | 'DOWN';
}
