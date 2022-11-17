import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amount } from '../entities/amount.entity';
import { Investment } from '../entities/investment.entity';

@Injectable()
export class AmountService {
  constructor(
    @InjectRepository(Amount)
    private amountRepository: Repository<Amount>,
  ) {}

  private totalId: string;

  async findOne(): Promise<Amount> {
    return await this.amountRepository.findOneBy({ id: this.totalId });
  }

  async saveAmount(amount: Amount): Promise<Amount> {
    return await this.amountRepository.save(amount);
  }

  async addAmount(investment: Investment): Promise<Amount> {
    let amount = await this.findOne();
    if (!amount) {
      amount = new Amount();
    }
    amount.total = amount.total
      ? amount.total + investment.amount
      : investment.amount;
    const result = await this.amountRepository.save(amount);
    this.totalId = result.id;
    return await this.amountRepository.save(amount);
  }
}
