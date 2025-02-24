import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './dal/comment.repository';
import { Comment } from './dal/comment.schema';
import { Types } from 'mongoose';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(
    content: string,
    authorId: string,
    postId: string,
    parentCommentId?: string,
  ): Promise<Comment | null> {
    const commentData: Partial<Comment> = {
      content,
      author: new Types.ObjectId(authorId),
      post: new Types.ObjectId(postId),
      parentComment: parentCommentId
        ? new Types.ObjectId(parentCommentId)
        : undefined, // ✅ Use `undefined` instead of `null`
    };
    return this.commentRepository.createComment(commentData);
  }

  async getCommentById(commentId: string): Promise<Comment> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async getCommentsByPost(postId: string): Promise<Comment[]> {
    return this.commentRepository.findByPost(postId);
  }

  async getReplies(parentCommentId: string): Promise<Comment[]> {
    return this.commentRepository.findReplies(parentCommentId);
  }

  async updateComment(commentId: string, content: string): Promise<Comment> {
    const updatedComment = await this.commentRepository.updateComment(
      commentId,
      content,
    );
    if (!updatedComment) throw new NotFoundException('Comment not found');
    return updatedComment;
  }

  async deleteComment(commentId: string): Promise<void> {
    const deletedComment =
      await this.commentRepository.deleteComment(commentId);
    if (!deletedComment) throw new NotFoundException('Comment not found');
  }

  async likeComment(
    commentId: string,
    userId: string,
  ): Promise<Comment | null> {
    return this.commentRepository.addLike(commentId, userId);
  }

  async unlikeComment(
    commentId: string,
    userId: string,
  ): Promise<Comment | null> {
    return this.commentRepository.removeLike(commentId, userId);
  }
}
