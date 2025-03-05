import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PostDocument = HydratedDocument<Post>;
export enum Format {
  Markdown = 'markdown',
  Html = 'html',
  Text = 'text',
}

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
  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: String })
  htmlContent?: string;

  @Prop({ type: String, enum: Format, default: Format.Text })
  format: Format;
}

export const PostSchema = SchemaFactory.createForClass(Post);
