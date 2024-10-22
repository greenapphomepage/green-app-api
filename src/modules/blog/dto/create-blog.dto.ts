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
import { TypeScreenEnum } from '../../screen/enum/type-screen.enum';
import { TagScreenEnum } from '../../screen/enum/tag-screen.enum';

export class CreateBlogDto {
  @ApiProperty({
    type: 'string',
    example: 'name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public title: string;

  @ApiProperty({
    type: 'string',
    example: 'thumbnail',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public thumbnail: string;

  @ApiProperty({
    type: 'string',
    example: 'content',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public content: string;

  @ApiProperty({
    type: 'string',
    example: 'description',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public description: string;

  @ApiProperty({
    type: 'string',
    example: 'keywords',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public keywords: string;

  @ApiProperty({
    type: 'array',
    example: ['hashTags'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public hashTags: string[];

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  public categoryId: number;
}
