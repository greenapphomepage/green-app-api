import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import config from 'src/config/config';

@Exclude()
export class CreatePermissionDto {
  @ApiProperty({ type: 'string', example: 'permission_key,max:100,required' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @Matches(config.REGEX_LETTER.value)
  @Matches(config.NOT_ONLY_SPACES.value)
  public permission_key: string;

  @ApiProperty({ type: 'string', example: 'permission_name,max:100,required' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @Matches(config.REGEX_LETTER.value)
  @Matches(config.NOT_ONLY_SPACES.value)
  public permission_name: string;
}
