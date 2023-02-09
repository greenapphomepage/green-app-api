import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

@Exclude()
export class TwoFaStatusUpdateDto {
  @ApiProperty({ type: 'boolean' })
  @Expose()
  @IsBoolean()
  isTwoFAEnabled: boolean;
}
