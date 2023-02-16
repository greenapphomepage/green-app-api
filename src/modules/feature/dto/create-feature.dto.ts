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
export class CreateFeatureDto {
  @ApiProperty({
    type: 'string',
    example: 'featureName,required',
    required: true,
    nullable: false,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Matches(config.REGEX_LETTER.value)
  @Matches(config.NOT_ONLY_SPACES.value)
  public featureName: string;

  @ApiProperty({ type: 'string', example: 'featureKey,required' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @Matches(config.REGEX_LETTER.value)
  @Matches(config.NOT_ONLY_SPACES.value)
  public featureKey: string;

  @ApiProperty({ type: 'string', example: 'extra' })
  @Expose()
  @IsOptional()
  @IsString()
  image;

  @ApiProperty({ type: 'string', example: 'extra' })
  @Expose()
  @IsOptional()
  @IsString()
  extra;
}
