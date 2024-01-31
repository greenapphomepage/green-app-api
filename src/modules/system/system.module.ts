import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import {AwsModule} from "../s3/aws.s3.module";

@Module({
  imports : [AwsModule],
  providers: [SystemService],
  controllers: [SystemController],
})
export class SystemModule {}
