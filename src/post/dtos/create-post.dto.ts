import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreatePostDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  slug: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  excerpt: string;

  @IsString()
  @IsOptional()
  featuredImage: string;

  @IsMongoId() // Author should be a valid MongoDB ObjectId
  author: Types.ObjectId;

  @IsArray()
  categories: Types.ObjectId[];
}
