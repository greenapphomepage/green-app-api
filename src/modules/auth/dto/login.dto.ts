import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsHash, IsNotEmpty } from 'class-validator';

export class LoginPostDTO {
  @ApiProperty({ example: 'admin@greenapp.com' })
  @IsEmail()
  @IsNotEmpty()
  user_email: string;

  @ApiProperty({ example: 'e10adc3949ba59abbe56e057f20f883e' })
  @IsHash('md5')
  @IsNotEmpty()
  user_password: string;
}
