import { Body, Injectable, Param } from '@nestjs/common';
import { PostRepository } from './dal/posts.repository';
import { FilterQuery, ObjectId, Types, UpdateQuery } from 'mongoose';
import { Post, PostDocument } from './dal/post.schema';
import { CreatePostDTO } from './dtos/create-post.dto';
import { generateSlug } from 'src/shared/utils/generate.slug';
import { generateExcerpt } from 'src/shared/utils/generate.excerpt';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  /**
   * Creates a new post. If a slug is not provided in the `createPostDto`, it
   * generates one automatically from the post title using the `generateSlug`
   * function.
   *
   * @param createPostDto The data for the new post.  This object should conform
   *                      to the `CreatePostDTO` class, including the post's
   *                      `title`, `content`, `excerpt`, `featuredImage`, `author`
   *                      (a MongoDB ObjectId), and `categories` (an array of
   *                      MongoDB ObjectIds). The `slug` property is optional.
   * @returns A promise that resolves to the newly created post object.
   * @throws {Error} If there is an error during post creation (e.g., database error).
   *
   * @example
   * ```typescript
   * const newPostData: CreatePostDTO = {
   *   title: "My Awesome Blog Post",
   *   content: "This is the content of my post.",
   *   excerpt: "A short summary...",
   *   featuredImage: "url-to-image.jpg",
   *   author: new Types.ObjectId("649c0b1e8f9c5d1a7b2a3b4c"), // Example ObjectId
   *   categories: [new Types.ObjectId("649c0b1e8f9c5d1a7b2a3b4d"), new Types.ObjectId("649c0b1e8f9c5d1a7b2a3b4e")], // Example ObjectIds
   * };
   *
   * const createdPost = await this.createPost(newPostData);
   * console.log(createdPost); // The newly created post, with the generated slug.
   *
   * const postWithSlug: CreatePostDTO = {
   *   title: "Another Post",
   *   content: "Content goes here.",
   *   excerpt: "Another summary",
   *   featuredImage: "another-image.png",
   *   author: new Types.ObjectId("649c0b1e8f9c5d1a7b2a3b4c"),
   *   categories: [new Types.ObjectId("649c0b1e8f9c5d1a7b2a3b4d")],
   *   slug: "another-post-slug", // Slug provided manually
   * };
   *
   * const createdWithSlug = await this.createPost(postWithSlug);
   * console.log(createdWithSlug); // The new post, using the provided slug.
   * ```
   */
  async createPost(createPostDto: CreatePostDTO) {
    let slug = generateSlug(createPostDto.title);
    let counter = 1;
    while (true) {
      const existingPost = await this.postRepository.findPostBySlug({ slug });

      if (!existingPost) {
        createPostDto.slug = slug;
        break;
      }

      slug = generateSlug(createPostDto.title) + `-${counter}`;
      counter++;
    }
    if (!createPostDto.slug) {
      createPostDto.slug = generateSlug(createPostDto.title);
    }
    if (!createPostDto.excerpt) {
      createPostDto.excerpt = generateExcerpt(createPostDto.content);
    }
    console.log(createPostDto.slug);
    console.log(createPostDto.excerpt);
    return await this.postRepository.create(createPostDto);
  }

  /**
   * Retrieves a post by its unique identifier.
   * @param postId - The ID of the post to retrieve.
   * @returns A promise that resolves to the post document or `null` if not found.
   */
  async getPostById(postId: string): Promise<Post | null> {
    return await this.postRepository.findOne({ _id: postId });
  }

  /**
   * Retrieves a post by slug
   *
   * @param slug - the slug og the post to retrieve
   * @returns A promise that resolves to the post document or `null` if not found
   */

  async getPostBySlug(slug: string): Promise<Post | null> {
    return await this.postRepository.findPostBySlug({ slug });
  }

  /**
   * Retrieves paginated posts based on the provided page and limit.
   * @param page - The current page number (default is 1).
   * @param limit - The number of posts per page (default is 10).
   * @returns A promise that resolves to an object containing paginated data and metadata.
   *          - `data`: Array of posts for the current page.
   *          - `hasPrevious`: Boolean indicating if there is a previous page.
   *          - `hasNext`: Boolean indicating if there is a next page.
   *          - `currentPage`: The current page number.
   */
  async getPaginatedPosts(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Post[] | null;
    hasPrevious: boolean;
    hasNext: boolean;
    currentPage: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      return this.postRepository.getPaginatedDocument(
        {}, // Query
        {}, // Projection
        { path: 'author', select: { firstName: 1, lastName: 1, _id: 0 } }, // Fixed population path
        { createdAt: -1 }, // Sorting
        skip,
        limit,
      );
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  /**
   * Updates a post based on a query.
   * @param query - The query object to match the post.
   * @param updateData - The data to update the post with.
   * @returns A promise resolving to the updated post or null if not found.
   */
  async updatePost(
    query: FilterQuery<Post | null>,
    updateData: UpdateQuery<PostDocument>,
  ): Promise<Post | null> {
    return await this.postRepository.updatePost(query, updateData);
  }

  /**
   * Deletes a post based on a query.
   * @param query - The query object to match the post.
   * @returns A promise resolving to true if deletion was successful, false otherwise.
   */
  async deletePost(query: object): Promise<boolean | null> {
    return await this.postRepository.deletePost(query);
  }
}
