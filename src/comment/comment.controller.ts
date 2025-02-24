import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createComment(
    @Body('content') content: string,
    @Body('authorId') authorId: string,
    @Body('postId') postId: string,
    @Body('parentCommentId') parentCommentId?: string,
  ) {
    return this.commentService.createComment(
      content,
      authorId,
      postId,
      parentCommentId,
    );
  }

  @Get(':id')
  async getCommentById(@Param('id') commentId: string) {
    return this.commentService.getCommentById(commentId);
  }

  @Get('post/:postId')
  async getCommentsByPost(@Param('postId') postId: string) {
    return this.commentService.getCommentsByPost(postId);
  }

  @Get('replies/:parentCommentId')
  async getReplies(@Param('parentCommentId') parentCommentId: string) {
    return this.commentService.getReplies(parentCommentId);
  }

  @Put(':id')
  async updateComment(
    @Param('id') commentId: string,
    @Body('content') content: string,
  ) {
    return this.commentService.updateComment(commentId, content);
  }

  @Delete(':id')
  async deleteComment(@Param('id') commentId: string) {
    await this.commentService.deleteComment(commentId);
    return { message: 'Comment deleted successfully' };
  }

  @Post(':id/like')
  async likeComment(
    @Param('id') commentId: string,
    @Body('userId') userId: string,
  ) {
    return this.commentService.likeComment(commentId, userId);
  }

  @Post(':id/unlike')
  async unlikeComment(
    @Param('id') commentId: string,
    @Body('userId') userId: string,
  ) {
    return this.commentService.unlikeComment(commentId, userId);
  }
}
