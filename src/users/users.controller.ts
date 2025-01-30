import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Get,
  Post,
  SerializeOptions,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserResponseDTO } from './entities/user.entity';
import { plainToClass, plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/Guard/auth.guard';
import { User } from './schema/user.schema';

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
  @UseGuards(AuthGuard)
  @Get('/getusers')
  async getUsers(): Promise<User[]> {
    const user = await this.usersService.findAll();
    return plainToInstance(UserResponseDTO, user);
  }
}
