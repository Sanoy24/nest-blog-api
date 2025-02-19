import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './dtos/create-post.dto';
import { MongooseError, Types } from 'mongoose';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  private readonly logger = new Logger(PostController.name); // Create a logger instance

  @Post()
  async createPost(@Body() createPostDto: CreatePostDTO) {
    try {
      const post = await this.postService.createPost(createPostDto);
      return post;
    } catch (error) {
      this.logger.error(`Error creating post: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error; // Re-throw known NestJS exceptions
      } else if (error.name === 'ValidationError') {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else if (error instanceof MongooseError) {
        throw new ConflictException('Slug already exists'); // Use ConflictException
      } else {
        throw new InternalServerErrorException('An unexpected error occurred.');
      }
    }
  }

  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string) {
    const post = await this.postService.getPostBySlug(slug);
    if (!post) {
      throw new NotFoundException(`Blog with post slug ${slug} not found`);
    }
    return post;
  }

  @Get()
  async getAllPosts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    console.log(page, limit, '-------------------------------------');
    // Validate and default the page and limit parameters
    const parsedPage = parseInt(page ?? '1', 10); // Default to 1 if invalid or missing
    const parsedLimit = parseInt(limit ?? '10', 10); // Default to 10 if invalid or missing
    try {
      const posts = await this.postService.getPaginatedPosts(
        parsedPage,
        parsedLimit,
      );
      return posts;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Error fetching posts: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error('Error fetching posts', error);
      }
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updateData: Partial<CreatePostDTO>,
  ) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid ID format');
      }

      const query = { _id: new Types.ObjectId(id) };
      const post = await this.postService.updatePost(query, updateData);
      this.logger.debug(post);

      if (!post) {
        throw new NotFoundException(`Blog with id ${id} not found`);
      }

      return post;
    } catch (error) {
      this.logger.error(`Error updating post: ${error.message}`, error.stack);

      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('An unexpected error occurred.');
      }
    }
  }
}
