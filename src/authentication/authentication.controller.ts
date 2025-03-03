import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Query,
  Get,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Public } from 'src/shared/utils/publicRoute';
import { UsersService } from 'src/users/users.service';
import * as crypto from 'node:crypto';
import { sendMail } from 'src/shared/lib/sendVerificationMail';

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

  @Post('resend-email')
  async resendVerificationEmail(@Body() email: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isEmailVerified) {
      throw new BadRequestException('email already verified');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.usersService.updateUser(
      { _id: user._id },
      { verificationToken, verificationExpires },
    );

    await this.usersService.sendVerificationMail(email, verificationToken);
    return { success: true, message: 'New verification email sent' };
  }
}
