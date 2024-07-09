import { Module } from '@nestjs/common';
import { CloudinaryProvider } from '../cloudinary/cloudinary.provider';
import { UploadService } from '../service/upload.service';

@Module({
  imports: [],
  providers: [CloudinaryProvider, UploadService],
  exports: [CloudinaryProvider, UploadService],
})
export class CloudinaryModule {}
