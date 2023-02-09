import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SystemService } from './system.service';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import config from '../../config/config';
import { SendResponse } from 'src/utils/send-response';
import { ApiImplicitFormData } from 'src/decorator/api-implicit-form-data.decorator';
import { multerFileOptions, multerOptions } from '../../utils/multer_options';
import { Auth } from 'src/decorator/auth.decorator';
import {
  FileUploadDto,
  MultiFileUploadDto,
  UploadDto,
} from './upload-file.dto';

@ApiTags('Systems| Config')
@Controller('system')
export class SystemController {
  constructor(private readonly systemsService: SystemService) {}

  @Post('upload-mage')
  @HttpCode(200)
  // @Auth()
  // @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'images',
    type: FileUploadDto,
  })
  // @ApiImplicitFormData({ name: 'picture', required: false, type: 'file' })
  @UseInterceptors(FileInterceptor('picture', multerOptions))
  async UpdateInformation(@UploadedFile() picture: Express.Multer.File) {
    try {
      if (picture.size > +config.MAX_FILE_SIZE.value) {
        throw 'PICTURE_ERROR';
      }

      if (!picture) {
        throw 'PICTURE_ERROR';
      }

      const _save = await this.systemsService.SavePicture(
        'tmp',
        !picture ? undefined : picture,
      );
      return SendResponse.success(_save);
    } catch (e) {
      console.log(e);
      return SendResponse.error(e);
    }
  }

  @Post('multiple-upload')
  @HttpCode(200)
  // @Auth()
  // @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'images',
    type: MultiFileUploadDto,
  })
  @UseInterceptors(FilesInterceptor('pictures', 6, multerOptions))
  async uploadMultipleImage(
    @UploadedFiles() pictures: Array<Express.Multer.File>,
  ) {
    try {
      const listImage = [];
      if (pictures) {
        for (const picture of pictures) {
          if (picture.size > +config.MAX_FILE_SIZE.value) {
            throw 'PICTURE_ERROR';
          }

          if (!picture) {
            throw 'PICTURE_ERROR';
          }

          const _save = await this.systemsService.SavePicture(
            'tmp',
            !picture ? undefined : picture,
          );
          listImage.push(_save);
        }
      }
      return SendResponse.success(listImage);
    } catch (e) {
      console.log(e);
      return SendResponse.error(e);
    }
  }

  @Post('upload-file')
  @HttpCode(200)
  // @Auth()
  // @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'file',
    type: UploadDto,
  })
  // @ApiImplicitFormData({ name: 'picture', required: false, type: 'file' })
  @UseInterceptors(FileInterceptor('file', multerFileOptions))
  async UploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (file.size > +config.MAX_FILE_SIZE.value) {
        throw 'FILE_ERROR';
      }

      if (!file) {
        throw 'FILE_ERROR';
      }

      const _save = await this.systemsService.SavePicture(
        'tmp',
        !file ? undefined : file,
      );
      return SendResponse.success(_save);
    } catch (e) {
      console.log(e);
      return SendResponse.error(e);
    }
  }
}
