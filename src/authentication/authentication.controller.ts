import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Query,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Public } from 'src/shared/utils/publicRoute';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private authsService: AuthenticationService,
    private usersService: UsersService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    // console.log(signInDto);
    return this.authsService.signIn(signInDto.email, signInDto.password);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    const user = await this.usersService.findUserByToken({
      verificationToken: token,
    });
    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    await this.usersService.updateUser(
      { _id: user._id },
      {
        isEmailVerified: true,
        verificationToken: null,
      },
    );
    return { success: true, message: 'Email Verified Successfully' };
  }
}
