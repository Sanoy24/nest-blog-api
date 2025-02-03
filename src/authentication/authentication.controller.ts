import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private authsService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    // console.log(signInDto);
    return this.authsService.signIn(signInDto.email, signInDto.password);
  }
}
