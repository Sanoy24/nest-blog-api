import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './comment.schema';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async createComment(data: Partial<Comment>): Promise<Comment> {
    const comment = new this.commentModel(data);
    return comment.save();
  }

  async findById(commentId: string): Promise<Comment | null> {
    return this.commentModel
      .findById(commentId)
      .populate('author post parentComment likes')
      .exec();
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ post: new Types.ObjectId(postId) })
      .populate('author likes')
      .lean()
      .exec();
  }

  async findReplies(parentCommentId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ parentComment: new Types.ObjectId(parentCommentId) })
      .populate({
        path: 'author',
        select: 'firstName',
      })
      .populate('likes')
      .exec();
  }

  async updateComment(
    commentId: string,
    content: string,
  ): Promise<Comment | null> {
    return this.commentModel
      .findByIdAndUpdate(commentId, { content }, { new: true })
      .exec();
  }

  async deleteComment(commentId: string): Promise<Comment | null> {
    return this.commentModel.findByIdAndDelete(commentId).exec();
  }

  async addLike(commentId: string, userId: string): Promise<Comment | null> {
    return this.commentModel
      .findByIdAndUpdate(
        commentId,
        { $addToSet: { likes: new Types.ObjectId(userId) } },
        { new: true },
      )
      .exec();
  }

  async removeLike(commentId: string, userId: string): Promise<Comment | null> {
    return this.commentModel
      .findByIdAndUpdate(
        commentId,
        { $pull: { likes: new Types.ObjectId(userId) } },
        { new: true },
      )
      .exec();
  }
}
