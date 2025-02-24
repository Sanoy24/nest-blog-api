import { Injectable } from '@nestjs/common';
import { Category, CategoryDocument } from '../schema/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class CategoryDal {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(category: Partial<Category>): Promise<CategoryDocument> {
    return new this.categoryModel(category).save();
  }
  async findAll(): Promise<CategoryDocument[]> {
    return this.categoryModel.find({});
  }
  async updateCategory(
    id: string,
    updateData: Partial<Category>,
  ): Promise<CategoryDocument | null> {
    console.log('_ id _', id, '_ updated data _', updateData);
    const objectid = new Types.ObjectId(id);
    return this.categoryModel.findOneAndUpdate({ _id: objectid }, updateData, {
      new: true,
    });
  }
}
