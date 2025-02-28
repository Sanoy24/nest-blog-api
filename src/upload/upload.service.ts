import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    let filename = file.originalname;

    if (file.originalname.split(' ') !== undefined) {
      filename = file.originalname.split(' ').join('-').split('.')[0];
    }

    return new Promise((resolve, reject) => {
      const stream = v2.uploader.upload_stream(
        {
          folder: 'blog_posts',
          public_id: `${filename}-${Date.now()}`,
          overwrite: true,
        },
        (err: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (err) return reject(new Error(err.message));
          resolve(result.secure_url);
        },
      );
      Readable.from(file.buffer).pipe(stream);
    });
  }
}
