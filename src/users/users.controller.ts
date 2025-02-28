import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  ServiceUnavailableException,
  // Request,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserResponseDTO } from './entities/user.entity';
import { User } from './schema/user.schema';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { Public } from 'src/shared/utils/publicRoute';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('/signup')
  async signup(@Body() user: CreateUserDTO) {
    try {
      const userExists = await this.usersService.findOne(user.email);
      if (userExists) {
        throw new ConflictException('User already exists');
      }
      const createdUser = await this.usersService.create(user);
      await this.usersService.sendVerificationMail(user.email);

      // Serialize the response to exclude the password field
      return plainToInstance(UserResponseDTO, createdUser, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }
  @Get('/getusers')
  async getUsers(@Req() req: Request): Promise<User[] | null> {
    try {
      // console.log({ user: req?.user });
      console.log(req.user);
      const user = await this.usersService.findAll();
      return plainToInstance(UserResponseDTO, user);
    } catch {
      throw new Error('please try again');
    }
  }
}
