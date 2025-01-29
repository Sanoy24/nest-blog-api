import { Exclude, Expose } from 'class-transformer';

export class UserResponseDTO {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  _id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  password: string; // Exclude the password field
}
