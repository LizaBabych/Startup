import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Investment } from './investment.entity';

@Entity()
export class Amount {
  @PrimaryGeneratedColumn()
  id: string;

  // @ManyToOne(() => Investment, (investment) => investment.total)
  // @JoinColumn({ name: 'investment_id' })
  // investments: Investment;

  @Column({ nullable: true })
  total: number;

  @OneToMany(() => Investment, (investment) => investment.amount)
  investments: Investment[];
}
