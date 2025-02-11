import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions, ProjectionType } from 'mongoose';
import { Post, PostDocument } from './post.schema';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(post: Partial<Post>): Promise<PostDocument> {
    return new this.postModel(post).save();
  }
  async findOne(
    query: FilterQuery<PostDocument> = {},
    projection?: Partial<ProjectionType<PostDocument>>,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<Post | null> {
    let queryBuilder = this.postModel.findOne(query, projection);
    if (populate) {
      queryBuilder = queryBuilder.populate(populate);
    }
    return await queryBuilder.lean<Post>().exec();
  }

  async getPaginatedDocument(
    query: FilterQuery<PostDocument> = {},
    projection?: Partial<ProjectionType<PostDocument[]>>,
    populate?: PopulateOptions | PopulateOptions[],
    sort: Record<string, -1 | 1> = { createdAt: -1 },
    skip: number = 0,
    limit: number = 10,
  ): Promise<{
    data: Post[] | null;
    hasNext: boolean;
    hasPrevious: boolean;
    totalPages: number;
    currentPage: number;
  }> {
    let queryBuilder = this.postModel
      .find(query, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (populate) {
      queryBuilder = queryBuilder.populate(populate);
    }

    const data = await queryBuilder.lean<Post[]>().exec();
    const totalDocument = await this.postModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocument / limit);
    const currentPage = Math.ceil(skip / limit) + 1;

    return {
      data,
      hasNext: skip + limit < totalDocument,
      hasPrevious: skip > 0,
      totalPages,
      currentPage,
    };
  }

  async updatePost(
    query: FilterQuery<PostDocument>,
    updateData: Partial<PostDocument>,
  ): Promise<Post | null> {
    return await this.postModel
      .findOneAndUpdate(query, updateData, { new: true })
      .lean<Post>()
      .exec();
  }

  async deletePost(query: FilterQuery<PostDocument>): Promise<boolean> {
    const result = await this.postModel.deleteOne(query).exec();
    return result.deletedCount > 0;
  }

  async findPostBySlug(query: FilterQuery<PostDocument>): Promise<Post | null> {
    return await this.postModel.findOne(query).lean<Post>().exec();
  }
}
