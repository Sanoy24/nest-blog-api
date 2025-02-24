import { Injectable } from '@nestjs/common';
import { CategoryDal } from './dal/category.dal';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryDal) {}

  async createCategory(data: CreateCategoryDto) {
    return await this.categoryRepo.create(data);
  }
  async findAll() {
    return await this.categoryRepo.findAll();
  }
  async updateCategory(id: string, updateData: Partial<CreateCategoryDto>) {
    return await this.categoryRepo.updateCategory(id, updateData);
  }
}
