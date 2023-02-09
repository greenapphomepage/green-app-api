import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import config from 'src/config/config';

@Exclude()
export class RegisterUserDTO {
  public user_id: string;

  //   @Expose()
  //   @ApiProperty({ example: 'user_fullname' })
  //   @Matches(config.REGEX_LETTER.value)
  //   public user_fullname: string;

  //   @Expose()
  //   @ApiProperty({ example: 'user_nickname' })
  //   @Matches(config.NICKNAME.value)
  //   public user_nickname: string;

  @Expose()
  @ApiProperty({ example: 'email' })
  @IsEmail()
  public user_email: string;

  @Expose()
  @IsNotEmpty()
  @ApiProperty({ example: 'MD5 hash' })
  public user_password: string;

  public create_at: Date;

  public update_at: Date;
}
