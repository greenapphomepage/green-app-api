import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@Exclude()
export class CreateTypeDto {
  @ApiProperty({ type: 'string' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public name: string;

  // @ApiProperty({
  //   type: 'string',
  //   // example: `${TypeScreenEnum.APP} | ${TypeScreenEnum.WEB} | ${TypeScreenEnum.UX_UI} | ${TypeScreenEnum.ADMIN_PAGE}`,
  // })
  // @Expose()
  // @IsNotEmpty()
  // @IsString()
  // @MaxLength(255)
  // key: string;
}
