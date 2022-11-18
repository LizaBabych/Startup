import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Investment } from './investment.entity';
import { Role } from '../enums/role.enum';

@Entity()
export class User {
  @PrimaryColumn()
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @OneToMany(() => Investment, (investment) => investment.user)
  investment: Investment[];

  @OneToMany(() => User, (user) => user.inviter)
  invited_users: User[];

  @ManyToOne(() => User, (user) => user.invited_users)
  @JoinColumn({ name: 'inviter' })
  inviter: User;
}
