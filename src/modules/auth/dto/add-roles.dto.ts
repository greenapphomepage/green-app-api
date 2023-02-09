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
export class listRoleDto {
  public constructor(init?: Partial<listRoleDto>) {
    Object.assign(this, init);
  }

  @Expose()
  @ApiProperty({ example: 'role_id,required' })
  @IsInt()
  @IsPositive()
  public role_id: number;
}

@ApiExtraModels(listRoleDto)
@Exclude()
export class AddRolesDTO {
  @Expose()
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  user_id: number;

  @Expose()
  @ApiProperty({ type: 'array', items: { $ref: getSchemaPath(listRoleDto) } })
  @IsArray()
  @ValidateNested({ each: true })
  public role: listRoleDto[];
}
