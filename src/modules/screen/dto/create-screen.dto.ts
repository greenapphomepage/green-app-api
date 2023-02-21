import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import config from 'src/config/config';
import { TypeScreenEnum } from '../enum/type-screen.enum';
import { TagScreenEnum } from '../enum/tag-screen.enum';

@Exclude()
export class CreateScreenDto {
  @ApiProperty({
    type: 'string',
    example: 'name',
    required: true,
    nullable: false,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public nameOption: string;

  @ApiProperty({ type: 'string', example: 'image' })
  @Expose()
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({
    type: 'string',
    enum: TypeScreenEnum,
    // example: `${TypeScreenEnum.APP} | ${TypeScreenEnum.WEB} | ${TypeScreenEnum.UX_UI} | ${TypeScreenEnum.ADMIN_PAGE}`,
  })
  @Expose()
  @IsEnum(TypeScreenEnum)
  type: TypeScreenEnum;

  @ApiProperty({
    type: 'string',
    enum: TagScreenEnum,
    // example: `${TagScreenEnum.HOME_PAGE} | ${TagScreenEnum.LOGIN_PAGE} | ${TagScreenEnum.UI_PAGE} | ${TagScreenEnum.PROFILE_PAGE} | ${TagScreenEnum.PAYMENT_PAGE} | ${TagScreenEnum.SETTING_PAGE} | ${TagScreenEnum.REGISTER_PAGE} | ${TagScreenEnum.MESSAGE}`,
  })
  @Expose()
  @IsEnum(TagScreenEnum)
  tag: TagScreenEnum;

  @ApiProperty({ type: 'number' })
  @Expose()
  @IsNotEmpty()
  @IsInt()
  price: number;

  @ApiProperty({ type: 'number' })
  @Expose()
  @IsOptional()
  @IsInt()
  schedule: number;
}
