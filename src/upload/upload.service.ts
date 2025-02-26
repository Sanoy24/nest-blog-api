import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          { folder: 'blog_posts' },
          (err: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (err) return reject(new Error(err.message));
            resolve(result.secure_url);
          },
        )
        .end(file.buffer);
    });
  }
}
