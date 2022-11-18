import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../enums/role.enum';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<{ access_token: string; userId: string }> {
    const payload = {
      username: user.username,
      sub: user.userId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      userId: user.userId,
    };
  }

  async addUser(
    username: string,
    password: string,
    role?: Role,
    referral?: string,
  ): Promise<Pick<User, 'username' | 'userId'>> {
    const isUserExist = await this.usersService.findOne(username);
    if (isUserExist) {
      throw new ConflictException('User already exist');
    }
    const passwordHash = password ? await bcrypt.hash(password, 11) : null;
    return await this.usersService.addUser(
      username,
      passwordHash,
      role,
      referral,
    );
  }
}
