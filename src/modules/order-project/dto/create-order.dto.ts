import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import config from 'src/config/config';
import { PlatformEnum } from '../../../enum/platform.enum';
import { TypeScreenEnum } from '../../screen/enum/type-screen.enum';

@Exclude()
export class listOptionDto {
  public constructor(init?: Partial<listOptionDto>) {
    Object.assign(this, init);
  }

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

  @ApiProperty({
    type: 'string',
    example: 'name',
    required: true,
    nullable: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public nameOption: string;

  @ApiProperty({ type: 'number' })
  @Expose()
  @IsOptional()
  @IsInt()
  price: number;
}

@ApiExtraModels(listOptionDto)
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
    type: 'array',
    items: { type: 'string' },
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsArray()
  public planFile: [string];

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
    type: 'string',
    example: 'governmentSupport,required',
    required: true,
  })
  @Expose()
  @IsOptional()
  @IsString()
  public governmentSupport: string;

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
  @IsEmail()
  public email: string;

  @ApiProperty({
    type: 'string',
    example: 'presenter',
    required: true,
  })
  @Expose()
  @IsOptional()
  @IsString()
  public presenter: string;

  @ApiProperty({
    type: 'string',
    example: 'phone',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  // @IsPhoneNumber()
  public phone: string;

  @ApiProperty({
    type: 'string',
    example: 'WEB_APP | MOBILE_APP | BOTH | NOTHING',
    required: true,
  })
  @Expose()
  @IsOptional()
  @IsEnum(PlatformEnum)
  public platform: PlatformEnum;

  @ApiProperty({
    type: 'number',
    example: 'estimatedCost,required',
    required: true,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  public estimatedCost: number;

  @Expose()
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(listOptionDto) },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  public options: listOptionDto[];
}
