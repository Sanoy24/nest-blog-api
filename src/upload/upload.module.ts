import { Global, Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { CloudinaryProvider } from 'src/config/cloudinary.config';

@Global()
@Module({
  providers: [CloudinaryProvider, UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
