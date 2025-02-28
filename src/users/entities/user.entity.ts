import { Exclude, Expose } from 'class-transformer';

export class UserResponseDTO {
  @Expose()
  _id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  role: string;
  @Exclude()
  password: string;

  @Expose()
  verificationToken: string | null;

  @Expose()
  isEmailVerified: boolean;
}
