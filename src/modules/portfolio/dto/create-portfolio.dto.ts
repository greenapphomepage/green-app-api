import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import config from 'src/config/config';

@Exclude()
export class CreatePortfoliosDto {
  // @ApiProperty({
  //   type: 'string',
  //   example: 'portfolio_name,required',
  //   required: true,
  //   nullable: false,
  // })
  // @Expose()
  // @IsNotEmpty()
  // @IsString()
  // @MaxLength(30)
  // @Matches(config.REGEX_LETTER.value)
  // @Matches(config.NOT_ONLY_SPACES.value)
  // public portfolio_name: string;

  @ApiProperty({
    type: 'string',
    example: 'logo',
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public logo: string;

  @ApiProperty({
    type: 'string',
    example: 'title,required',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public title: string;

  @ApiProperty({
    type: 'string',
    example: 'programming_language,required',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public programming_language: string;

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
    type: 'array',
    items: { type: 'string' },
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsArray()
  public images: [string];
}
