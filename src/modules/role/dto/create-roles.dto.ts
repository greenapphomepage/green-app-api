import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import config from 'src/config/config';

@Exclude()
export class CreateRolesDto {
  @ApiProperty({ type: 'string', example: 'role_key,max:100,required' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @Matches(config.REGEX_LETTER.value)
  @Matches(config.NOT_ONLY_SPACES.value)
  public role_key: string;

  @ApiProperty({ type: 'string', example: 'role_name,max:100,required' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @Matches(config.REGEX_LETTER.value)
  @Matches(config.NOT_ONLY_SPACES.value)
  public role_name: string;
}
