import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true, versionKey: false })
export class Comment {
  @Prop({ type: String, required: true, trim: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId; // ✅ Changed from `User` to `Types.ObjectId`

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  post: Types.ObjectId; // ✅ Changed from `Post` to `Types.ObjectId`

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null })
  parentComment?: Types.ObjectId; // Optional parent comment (for nested replies)

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  likes: Types.ObjectId[]; // Stores users who liked the comment
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
