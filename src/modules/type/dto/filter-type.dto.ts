import { QueryListDto } from '../../../global/dto/query-list.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TypeScreenEnum } from '../../screen/enum/type-screen.enum';

export class FilterListTagDto extends QueryListDto {
  @Expose()
  @ApiProperty({ type: 'string', enum: TypeScreenEnum, required: false })
  @IsEnum(TypeScreenEnum)
  @IsOptional()
  public type: TypeScreenEnum;
}
