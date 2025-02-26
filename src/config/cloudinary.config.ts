import { v2, ConfigOptions } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CLOUDINARY } from 'src/authentication/constants';

// export const cloudinaryConfig = (configService: ConfigService) => {
//   cloudinary.config({
//     cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
//     api_key: configService.get<string>('CLOUDINARY_API_KEY'),
//     api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
//   });
// };

// export default cloudinary;

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (configService: ConfigService): ConfigOptions => {
    return v2.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  },
  inject: [ConfigService],
};
