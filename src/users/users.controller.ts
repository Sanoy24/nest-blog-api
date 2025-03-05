import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDTO } from './entities/user.entity';
import { User } from './schema/user.schema';
import { plainToInstance } from 'class-transformer';
import { Public } from 'src/shared/utils/publicRoute';
import * as crypto from 'node:crypto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('/signup')
  async signup(@Body() user: User): Promise<UserResponseDTO> {
    try {
      const userExists = await this.usersService.findOne(user.email);
      if (userExists) {
        throw new ConflictException('User already exists');
      }
      const verificationToken: string = crypto.randomBytes(32).toString('hex');

      const verificationTokenExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      );
      user.verificationToken = verificationToken;
      user.verificationExpires = verificationTokenExpires;

      console.log(user);

      const createdUser = await this.usersService.create(user);
      await this.usersService.sendVerificationMail(
        user.email,
        verificationToken,
      );

      // Serialize the response to exclude the password field
      return plainToInstance(UserResponseDTO, createdUser, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Sign up failed:${error.message}`, error.stack);
      }
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Signup faild, please try again.');
    }
  }
  @Get('/getusers')
  async getUsers(): Promise<User[] | null> {
    try {
      const user = await this.usersService.findAll();
      if (!user || user.length === 0) {
        throw new HttpException('No users found', HttpStatus.NOT_FOUND);
      }
      return plainToInstance(UserResponseDTO, user);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Get users failed:${error.message}`, error.stack);
      }
      throw new InternalServerErrorException(
        'Something went wrong please try again',
      );
    }
  }
}
