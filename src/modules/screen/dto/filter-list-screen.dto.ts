import { QueryListDto } from '../../../global/dto/query-list.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class FilterListScreenDto extends QueryListDto {
  @Expose()
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  public type: string;

  @Expose()
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  public tag: string;
}
