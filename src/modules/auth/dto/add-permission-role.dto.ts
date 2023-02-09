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
export class listPermissionRolesDto {
  public constructor(init?: Partial<listPermissionRolesDto>) {
    Object.assign(this, init);
  }

  @Expose()
  @ApiProperty({ example: 'permission_id,required' })
  @IsInt()
  @IsPositive()
  public permission_id: number;
}

@ApiExtraModels(listPermissionRolesDto)
@Exclude()
export class AddPermissionsRolesDTO {
  @Expose()
  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  @IsNotEmpty()
  role_id: number;

  @Expose()
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(listPermissionRolesDto) },
  })
  @IsArray()
  @ValidateNested({ each: true })
  public permission: listPermissionRolesDto[];
}
