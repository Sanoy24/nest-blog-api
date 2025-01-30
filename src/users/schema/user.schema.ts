import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { hashSync } from 'bcrypt';
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true })
  firstName: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: true })
  email: string;
  @Prop({
    required: true,
    set: (password: string) => hashSync(password, 10),
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
