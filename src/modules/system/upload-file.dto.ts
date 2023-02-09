import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  picture: any;
}
export class MultiFileUploadDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  pictures: any;
}

export class UploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
