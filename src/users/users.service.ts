import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { FilterQuery, Model, PopulateOptions, ProjectionType } from 'mongoose';
import { CreateUserDTO } from './dtos/create-user.dto';
import { sendMail } from '../shared/lib/sendVerificationMail';
// import { verificationToken } from 'src/shared/lib/generateVerificationToken';
import * as crypto from 'node:crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDTO): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean().exec();
  }
  async findOne(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).select('+password').exec();
  }

  async updateUser(
    query: FilterQuery<UserDocument>,
    updateData: Partial<UserDocument>,
  ): Promise<UserDocument | null> {
    return await this.userModel
      .findOneAndUpdate(query, updateData, { new: true })
      .lean()
      .exec();
  }

  async findUserByToken(
    query: FilterQuery<UserDocument> = {},
    projection?: Partial<ProjectionType<UserDocument>>,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<UserDocument | null> {
    let queryBuilder = this.userModel.findOne(query, projection);
    if (populate) {
      queryBuilder = queryBuilder.populate(populate);
    }
    return await queryBuilder.lean().exec();
  }

  async sendVerificationMail(to: string, token: string) {
    return await sendMail(to, token);
  }
}
