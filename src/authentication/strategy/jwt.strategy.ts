import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDTO } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'defaultSecret',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.username);
    //   return plainToInstance(UserResponseDTO, user);
    //   // return { userId: payload.sub, email: payload.username };
    // }
    return plainToInstance(UserResponseDTO, user, {
      excludeExtraneousValues: true,
    });
  }
}
