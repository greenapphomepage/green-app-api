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
  IsPositive,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

@Exclude()
export class UpdateOrderDto {
  public id: number;

  @ApiProperty({
    type: 'boolean',
    example: 'governmentSupport,required',
    required: true,
  })
  @Expose()
  @IsOptional()
  @IsBoolean()
  public isDone: boolean;

  // @ApiProperty({
  //   type: 'number',
  //   example: 'estimatedCost,required',
  //   required: true,
  // })
  // @Expose()
  // @IsOptional()
  // @IsInt()
  // public estimatedCost: number;

  // @ApiProperty({
  //   type: 'number',
  //   example: 'estimatedTime,required',
  //   required: true,
  // })
  // @Expose()
  // @IsOptional()
  // @IsString()
  // public estimatedTime: string;
  // @ApiProperty({
  //   type: 'string',
  //   example: 'projectName,required',
  //   required: true,
  //   nullable: false,
  // })
  // @Expose()
  // @IsOptional()
  // @IsString()
  // @MaxLength(30)
  // @Matches(config.REGEX_LETTER.value)
  // @Matches(config.NOT_ONLY_SPACES.value)
  // public projectName: string;
  //
  // @ApiProperty({
  //   type: 'string',
  //   example: 'planFile',
  //   required: false,
  // })
  // @Expose()
  // @IsOptional()
  // @IsString()
  // @MaxLength(255)
  // public planFile: string;
  //
  // @ApiProperty({
  //   type: 'number',
  //   example: 'title,required',
  //   required: true,
  // })
  // @Expose()
  // @IsOptional()
  // @IsInt()
  // @MaxLength(255)
  // public maximumBudget: number;
  //
  // @ApiProperty({
  //   type: 'boolean',
  //   example: 'governmentSupport,required',
  //   required: true,
  // })
  // @Expose()
  // @IsOptional()
  // @IsBoolean()
  // @MaxLength(255)
  // public governmentSupport: boolean;
  //
  // @ApiProperty({
  //   type: 'string',
  //   example: 'description',
  //   required: false,
  // })
  // @Expose()
  // @IsOptional()
  // @IsString()
  // public description: string;
  //
  // @ApiProperty({
  //   type: 'string',
  //   example: 'customerName',
  //   required: true,
  // })
  // @Expose()
  // @IsNotEmpty()
  // @IsString()
  // public customerName: string;
  //
  // @ApiProperty({
  //   type: 'string',
  //   example: 'companyName',
  //   required: true,
  // })
  // @Expose()
  // @IsOptional()
  // @IsString()
  // public companyName: string;
  //
  // @ApiProperty({
  //   type: 'string',
  //   example: 'position',
  //   required: true,
  // })
  // @Expose()
  // @IsOptional()
  // @IsString()
  // public position: string;
  //
  // @ApiProperty({
  //   type: 'string',
  //   example: 'email',
  //   required: true,
  // })
  // @Expose()
  // @IsNotEmpty()
  // @IsString()
  // public email: string;
  //
  // @ApiProperty({
  //   type: 'string',
  //   example: 'phone',
  //   required: true,
  // })
  // @Expose()
  // @IsNotEmpty()
  // @IsPhoneNumber()
  // public phone: string;
  //
  // @ApiProperty({
  //   type: 'string',
  //   example: 'description',
  //   required: true,
  // })
  // @Expose()
  // @IsOptional()
  // @IsEnum(PlatformEnum)
  // public platform: PlatformEnum;
}
