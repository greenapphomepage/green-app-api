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
    enum: TypeScreenEnum,
    // example: `${TypeScreenEnum.APP} | ${TypeScreenEnum.WEB} | ${TypeScreenEnum.UX_UI} | ${TypeScreenEnum.ADMIN_PAGE}`,
  })
  @Expose()
  @IsNotEmpty()
  @IsEnum(TypeScreenEnum)
  type: TypeScreenEnum;
}
