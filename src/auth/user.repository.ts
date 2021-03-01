import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentials: AuthCredentialsDto): Promise<void> {
    const user = new User();
    user.username = authCredentials.username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(
      authCredentials.password,
      user.salt,
    );
    try {
      await user.save();
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('username already exists');
      } else {
        console.log('unknown error', e);
        throw new InternalServerErrorException('internal error');
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
