import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TypeScreenEnum } from '../../screen/enum/type-screen.enum';

@Exclude()
export class UpdateTagDto {
  public id: number;
  @ApiProperty({ type: 'string' })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public name: string;

  @ApiProperty({
    type: 'string',
    description: 'key of type',
    default: 'UX_UI',
  })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  type: string;
}
