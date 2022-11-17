import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
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
}
