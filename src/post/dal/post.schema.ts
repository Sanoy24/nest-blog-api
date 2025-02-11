import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import { Category } from 'src/category/schema/category.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true, versionKey: false })
export class Post {
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String, required: true })
  content: string;
  @Prop({ type: String, trim: true })
  excerpt?: string;
  @Prop({ type: String })
  featuredImage?: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: Types.ObjectId;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }] })
  categories: Types.ObjectId[];
  @Prop([{ type: String }])
  tags: string[];
  @Prop({ type: Date, default: Date.now() })
  publishedAt?: Date;
  @Prop({ type: String, required: true })
  slug: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
