import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

@Exclude()
export class UpdateTypeDto {
  public id: number;
  @ApiProperty({ type: 'string' })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public name: string;

  @ApiProperty({
    type: 'string',
    // example: `${TypeScreenEnum.APP} | ${TypeScreenEnum.WEB} | ${TypeScreenEnum.UX_UI} | ${TypeScreenEnum.ADMIN_PAGE}`,
  })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  key: string;
}
