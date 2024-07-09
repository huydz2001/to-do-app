import { Injectable, Module } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { Group, User } from 'src/app/entities';
import { GroupModule, UserModule } from 'src/app/modules';
import { GroupService, UserService } from 'src/app/services';
import { Repository } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamifier = require('streamifier');

@Injectable()
export class UploadService {
  constructor() {}

  uploadFile(
    entity: string,
    id: number,
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          access_mode: 'public',
          folder: 'todo',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
