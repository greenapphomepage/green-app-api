import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';

@Exclude()
export class listPermissionDto {
  public constructor(init?: Partial<listPermissionDto>) {
    Object.assign(this, init);
  }

  @Expose()
  @ApiProperty({ example: 'permission_id,required' })
  @IsInt()
  @IsPositive()
  public permission_id: number;
}

@ApiExtraModels(listPermissionDto)
@Exclude()
export class AddPermissionsDTO {
  @Expose()
  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  @IsNotEmpty()
  user_id: number;

  @Expose()
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(listPermissionDto) },
  })
  @IsArray()
  @ValidateNested({ each: true })
  public permission: listPermissionDto[];
}
