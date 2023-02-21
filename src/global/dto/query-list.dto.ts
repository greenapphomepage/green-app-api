import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import config from 'src/config/config';

@Exclude()
export class QueryListDto {
  @Expose()
  @ApiProperty({ type: 'string', required: false })
  @IsIn(config.SORT_TYPE.value)
  @IsOptional()
  public sort: string;

  @Expose()
  @ApiProperty({ type: 'number', required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @IsPositive()
  public page: number;

  @Expose()
  @ApiProperty({ type: 'number', required: false })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @IsPositive()
  public perPage: number;

  @Expose()
  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  public keyword: string;
}
