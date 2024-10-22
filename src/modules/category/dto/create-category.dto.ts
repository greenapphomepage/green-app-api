import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import config from 'src/config/config';
import { TypeScreenEnum } from '../../screen/enum/type-screen.enum';

@Exclude()
export class CreateCategoryDto {
  @ApiProperty({ type: 'string' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public name: string;
}
