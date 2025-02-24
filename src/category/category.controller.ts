import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Post('/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateCategoryDto>,
  ) {
    console.log('___ this is the endpoint ____');
    return await this.categoryService.updateCategory(id, updateData);
  }
}
