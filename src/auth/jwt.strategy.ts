import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './dto/jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { Logger } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger('JwtStrategy');

  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
    this.logger.debug('JwtStrategy created');
  }

  async validate(payload: JwtPayload): Promise<User> {
    this.logger.debug('payload ' + JSON.stringify(payload));
    const user = await this.userRepository.findOne({
      username: payload.username,
    });
    this.logger.debug('user ' + JSON.stringify(user));
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
