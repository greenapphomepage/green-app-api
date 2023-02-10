import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsHash, IsNotEmpty } from 'class-validator';

export class LoginPostDTO {
  @ApiProperty({ example: 'admin@greenapp.com' })
  @IsEmail()
  @IsNotEmpty()
  user_email: string;

  @ApiProperty({ example: '41933e60e9c19b866b3d68864727afe7' })
  @IsHash('md5')
  @IsNotEmpty()
  user_password: string;
}
