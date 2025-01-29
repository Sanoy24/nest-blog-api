import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Get,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserResponseDTO } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async signup(@Body() user: CreateUserDTO) {
    const userExists = await this.usersService.findOne(user.email);
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    const createdUser = await this.usersService.create(user);

    // Serialize the response to exclude the password field
    return plainToInstance(UserResponseDTO, createdUser, {
      excludeExtraneousValues: true,
    });
  }
  @Get('/getusers')
  async getUsers() {
    return await this.usersService.findAll();
  }
}
