import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';

export class DeletePortfolioDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'number' },
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsArray()
  public ids: [number];
}
