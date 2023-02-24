import { QueryListDto } from '../../../global/dto/query-list.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TypeScreenEnum } from '../../screen/enum/type-screen.enum';

export class FilterListTagDto extends QueryListDto {
  @ApiProperty({
    type: 'string',
    description: 'key of type',
    default: 'UX_UI',
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  type: string;
}
