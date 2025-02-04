import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserResponseDTO } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { stringify } from 'querystring';
import { report } from 'process';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user: UserDocument | null = await this.usersService.findOne(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await user.comparePassword(pass))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Exclude sensitive fields and transform the user object to DTO
    const userDto = plainToInstance(UserResponseDTO, user.toJSON(), {
      excludeExtraneousValues: true, // Ensures only DTO fields are included
    });

    return this.signToken(userDto._id, userDto.email);
    // Generate JWT token

    // const accessToken = await this.jwtService.signAsync(payload);

    // return {
    //   access_token: accessToken,
    //   user: userDto,
    // };
  }
  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, username: email };
    const accessToken = await this.jwtService.signAsync(payload);
    return { access_token: accessToken };
  }
}
