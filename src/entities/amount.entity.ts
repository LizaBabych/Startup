import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Investment } from './investment.entity';

@Entity()
export class Amount {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  total: number;

  @OneToMany(() => Investment, (investment) => investment.amount)
  investments: Investment[];
}
