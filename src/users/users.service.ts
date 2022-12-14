import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Role } from '../enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async saveUser(user: User): Promise<User | undefined> {
    return this.usersRepository.save(user);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ username });
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException({
        message: `User with ${userId} is not exist`,
      });
    }
    return user;
  }

  async findAllUsers(): Promise<User[]> {
    return await this.usersRepository.find({
      where: { userId: Not(IsNull()) },
    });
  }

  async getAllInviters(): Promise<User[]> {
    return await this.usersRepository.find({
      where: { invited_users: true },
      select: ['userId', 'invited_users'],
    });
  }

  async getAllInvitedUsersByInviterId(inviter: User): Promise<User[]> {
    return await this.usersRepository.find({
      where: { inviter },
      select: ['userId', 'inviter'],
    });
  }

  async getAdmin(): Promise<User> {
    return await this.usersRepository.findOne({
      where: { role: Role.Admin },
    });
  }

  async addUser(
    username: string,
    password: string,
    role?: Role,
    referral?: string,
  ): Promise<Pick<User, 'username' | 'userId'>> {
    const newUser = new User();
    newUser.userId = uuidv4();
    newUser.username = username;
    newUser.password = password;

    if (referral) {
      newUser.inviter = await this.findUserById(referral);
    }

    if (role) {
      newUser.role = role;
    }

    const user = await this.usersRepository.save(newUser);

    return {
      username: user.username,
      userId: user.userId,
    };
  }
}
