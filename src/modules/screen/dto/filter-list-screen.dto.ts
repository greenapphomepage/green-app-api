import { QueryListDto } from '../../../global/dto/query-list.dto';
import { Expose, Type } from 'class-transformer';
import {ApiProperty, PickType} from '@nestjs/swagger';
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
  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  public type: string;

  @Expose()
  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  public tag: string;
}

export class FilterListScreenV2Dto extends PickType(FilterListScreenDto,['type','tag','sort']) {

}