import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserResponseDTO } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/users/schema/user.schema';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; user: User }> {
    const user: UserDocument | null = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log(pass, user.password);
    if (user && !bcrypt.compareSync(pass, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log('[ - user -]', user);
    // TODO : Generate Jwt and return it here
    // instead of returning user object
    const payload = { sub: user._id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: plainToInstance(UserResponseDTO, user),
    };
  }
}
