import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import config from 'src/config/config';
import { PlatformEnum } from '../../../enum/platform.enum';

@Exclude()
export class CreateOrderDto {
  @ApiProperty({
    type: 'string',
    example: 'projectName,required',
    required: true,
    nullable: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  @Matches(config.REGEX_LETTER.value)
  @Matches(config.NOT_ONLY_SPACES.value)
  public projectName: string;

  @ApiProperty({
    type: 'string',
    example: 'planFile',
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  public planFile: string;

  @ApiProperty({
    type: 'number',
    example: 'maximumBudget,required',
    required: true,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  public maximumBudget: number;

  @ApiProperty({
    type: 'boolean',
    example: 'governmentSupport,required',
    required: true,
  })
  @Expose()
  @IsOptional()
  @IsBoolean()
  public governmentSupport: boolean;

  @ApiProperty({
    type: 'string',
    example: 'description',
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  public description: string;

  @ApiProperty({
    type: 'string',
    example: 'customerName',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  public customerName: string;

  @ApiProperty({
    type: 'string',
    example: 'companyName',
    required: true,
  })
  @Expose()
  @IsOptional()
  @IsString()
  public companyName: string;

  @ApiProperty({
    type: 'string',
    example: 'position',
    required: true,
  })
  @Expose()
  @IsOptional()
  @IsString()
  public position: string;

  @ApiProperty({
    type: 'string',
    example: 'email',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  public email: string;

  @ApiProperty({
    type: 'string',
    example: 'phone',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsPhoneNumber()
  public phone: string;

  @ApiProperty({
    type: 'string',
    example: 'description',
    required: true,
  })
  @Expose()
  @IsOptional()
  @IsEnum(PlatformEnum)
  public platform: PlatformEnum;
}
