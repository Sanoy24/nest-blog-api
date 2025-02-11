import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CategoryModule } from '../category.module';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, versionKey: false })
export class Category {
  @Prop({ required: true, type: String, unique: true, trim: true })
  name: string;

  @Prop({ type: String, trim: true })
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
