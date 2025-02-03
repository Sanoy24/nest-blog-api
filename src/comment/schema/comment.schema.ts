import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Post } from 'src/post/schema/post.schema';
import { User } from 'src/users/schema/user.schema';

export type CommentDocument = HydratedDocument<Comment>;
@Schema({ timestamps: true, versionKey: false })
export class Comment {
  @Prop({ type: String, required: true, trim: true })
  content: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  post: Post;
  @Prop({ type: mongoose.Schema.Types.ObjectId, default: Date.now })
  parentComment: Comment;
  likes: [User];
}
