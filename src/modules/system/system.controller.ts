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
  MultiFile2UploadDto,
  MultiFileUploadDto,
  UploadDto,
} from './upload-file.dto';
import {AwsS3Service} from "../s3/aws.s3.service";
import {UtilsProvider} from "../../utils/provider";

@ApiTags('Systems| Config')
@Controller('system')
export class SystemController {
  constructor(
      private readonly systemsService: SystemService,
      private readonly awsS3Service: AwsS3Service,
      ) {}

  @Post('upload-image')
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

  @Post('multiple-file')
  @HttpCode(200)
  // @Auth()
  // @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'files',
    type: MultiFile2UploadDto,
  })
  @UseInterceptors(FilesInterceptor('files', 6, multerFileOptions))
  async uploadMultipleFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    try {
      const listFile = [];
      if (files) {
        for (const file of files) {
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
          listFile.push(_save);
        }
      }
      return SendResponse.success(listFile);
    } catch (e) {
      console.log(e);
      return SendResponse.error(e);
    }
  }
  @Post('upload-s3')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'images',
    type: FileUploadDto,
  })
  @UseInterceptors(FileInterceptor('picture', multerOptions))
  async UploadS3(@UploadedFile() picture: Express.Multer.File) {
      if (picture.size > +config.MAX_FILE_SIZE.value) {
        throw 'PICTURE_ERROR';
      }

      if (!picture) {
        throw 'PICTURE_ERROR';
      }
    try {
      const filename: string = picture.originalname;
      const mime: string = filename
          .substring(filename.lastIndexOf('.') + 1, filename.length)
          .toUpperCase();
      const name = UtilsProvider.randomString(
          config.RANDOM_STRING_LENGTH.value,
      );
      const _save = await this.awsS3Service.putItemInBucket(`${name}.${mime}`,picture.mimetype,picture.buffer)
      return SendResponse.success(_save);
    } catch (e) {
      console.log(e);
      return SendResponse.error(e);
    }
  }
  @Post('upload-file-s3')
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'file',
    type: UploadDto,
  })
  // @ApiImplicitFormData({ name: 'picture', required: false, type: 'file' })
  @UseInterceptors(FileInterceptor('file', multerFileOptions))
  async UploadFileS3(@UploadedFile() file: Express.Multer.File) {
      if (file.size > +config.MAX_FILE_SIZE.value) {
        throw 'FILE_ERROR';
      }

      if (!file) {
        throw 'FILE_ERROR';
      }
    try {

      const filename: string = file.originalname;
      const mime: string = filename
          .substring(filename.lastIndexOf('.') + 1, filename.length)
          .toUpperCase();
      const name = UtilsProvider.randomString(
          config.RANDOM_STRING_LENGTH.value,
      );
      const _save = await this.awsS3Service.putItemInBucket(`${name}.${mime}`,file.mimetype,file.buffer)
      return SendResponse.success(_save);
    } catch (e) {
      console.log(e);
      return SendResponse.error(e);
    }
  }
}
