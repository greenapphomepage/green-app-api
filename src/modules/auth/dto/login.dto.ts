import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsHash, IsNotEmpty } from 'class-validator';

export class LoginPostDTO {
  @ApiProperty({ example: 'Email' })
  @IsEmail()
  @IsNotEmpty()
  user_email: string;

  @ApiProperty({ example: 'MD5 Hash' })
  @IsHash('md5')
  @IsNotEmpty()
  user_password: string;
}
