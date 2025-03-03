import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
export type UserDocument = HydratedDocument<User> & {
  comparePassword(candidatePassword: string): Promise<boolean>;
};

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: string;

  @Prop({ type: String || null })
  verificationToken: string | null;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ type: String || null })
  verificationExpires: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next: NextFunction) {
  const user = this as UserDocument;
  if (!user.isModified('password')) return next();
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(user.password, salt);
  user.password = hashedPassword;
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  const user = this as UserDocument;
  if (!user.password) return false;
  return await bcrypt.compare(candidatePassword, user.password);
};
