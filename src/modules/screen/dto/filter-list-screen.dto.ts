import { QueryListDto } from '../../../global/dto/query-list.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { TypeScreenEnum } from '../enum/type-screen.enum';

export class FilterListScreenDto extends QueryListDto {
  @Expose()
  @ApiProperty({ type: 'string', enum: TypeScreenEnum, required: false })
  @IsEnum(TypeScreenEnum)
  @IsOptional()
  public type: TypeScreenEnum;

  @Expose()
  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  public tag: string;
}
