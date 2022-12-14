import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Amount } from './amount.entity';
import { AmountType } from '../enums/amountType.enum';

@Entity()
export class Investment {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.investment)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  amount: number;

  @Column({ nullable: true })
  date: Date;

  @Column({ default: 0 })
  percents: number;

  @Column({
    type: 'enum',
    enum: AmountType,
    default: AmountType.Operation,
  })
  type: AmountType;

  @ManyToOne(() => Amount, (amount) => amount.investments)
  @JoinColumn({ name: 'total_amount_id' })
  amounts: Amount;
}
