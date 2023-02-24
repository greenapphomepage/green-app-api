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
export class CreateTagDto {
  @ApiProperty({ type: 'string' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public name: string;

  @ApiProperty({
    type: 'string',
    description: 'key of type',
    default: 'UX_UI',
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  type: string;
}
