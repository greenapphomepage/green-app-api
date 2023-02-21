import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TypeScreenEnum } from '../../screen/enum/type-screen.enum';

@Exclude()
export class UpdateTagDto {
  public id: number;
  @ApiProperty({ type: 'string' })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public name: string;

  @ApiProperty({
    type: 'string',
    enum: TypeScreenEnum,
    // example: `${TypeScreenEnum.APP} | ${TypeScreenEnum.WEB} | ${TypeScreenEnum.UX_UI} | ${TypeScreenEnum.ADMIN_PAGE}`,
  })
  @Expose()
  @IsOptional()
  @IsEnum(TypeScreenEnum)
  type: TypeScreenEnum;
}
