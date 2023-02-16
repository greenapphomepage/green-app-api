import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import config from 'src/config/config';

@Exclude()
export class UpdateFeatureDto {
  public id: number;
  @ApiProperty({
    type: 'string',
    example: 'featureName,required',
    required: true,
    nullable: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Matches(config.REGEX_LETTER.value)
  @Matches(config.NOT_ONLY_SPACES.value)
  public featureName: string;

  @ApiProperty({ type: 'string', example: 'featureKey,required' })
  @Expose()
  @IsOptional()
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
