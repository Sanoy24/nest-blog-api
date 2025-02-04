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
  ServiceUnavailableException,
  // Request,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserResponseDTO } from './entities/user.entity';
import { plainToClass, plainToInstance } from 'class-transformer';
// import { AuthGuard } from 'src/Guard/auth.guard';
import { User } from './schema/user.schema';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/Guard/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async signup(@Body() user: CreateUserDTO) {
    try {
      const userExists = await this.usersService.findOne(user.email);
      if (userExists) {
        throw new ConflictException('User already exists');
      }
      const createdUser = await this.usersService.create(user);

      // Serialize the response to exclude the password field
      return plainToInstance(UserResponseDTO, createdUser, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('/getusers')
  async getUsers(@Req() req: Request): Promise<User[] | null> {
    try {
      // console.log({ user: req?.user });
      console.log(req.user);
      const user = await this.usersService.findAll();
      return plainToInstance(UserResponseDTO, user);
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new JsonWebTokenError('token expired', error);
      } else {
        throw new Error('please try again');
      }
    }
  }
}
