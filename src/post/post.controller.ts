import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './dtos/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('/create-post')
  async createPost(@Body() createPostDto: CreatePostDTO) {
    try {
      const post = await this.postService.createPost(createPostDto);
      return post;
    } catch (error) {
      console.log(error);
    }
  }

  @Get('getsinglepost/:slug')
  async getPostBySlug(@Param('slug') slug: string) {
    const post = await this.postService.getPostBySlug(slug);
    return post;
  }

  @Get('/paginatedposts')
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
    } catch (error) {
      console.log('--------------', error);
      throw new Error(error);
    }
  }

  async updatePost() {}
}
