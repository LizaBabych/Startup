import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { Investment } from '../entities/investment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { AmountService } from '../amount/amount.service';
import { Role } from '../enums/role.enum';
import { User } from '../entities/user.entity';
import { AmountType } from '../enums/amountType.enum';

@Injectable()
export class InvestService {
  constructor(
    @InjectRepository(Investment)
    private investmentRepository: Repository<Investment>,
    private amountService: AmountService,
    private usersService: UsersService,
  ) {}

  async saveInvestment(investments: Investment[]): Promise<Investment[]> {
    return await this.investmentRepository.save(investments);
  }

  async getAllCurrentInvestments(): Promise<Investment[]> {
    return await this.investmentRepository.find({
      where: { user: Not(IsNull()) },
    });
  }

  async getInvestmentsByUser(user: User): Promise<Investment[]> {
    return await this.investmentRepository.find({
      where: { user },
    });
  }

  async invest(
    userId: string,
    sum: number,
    type: AmountType = AmountType.Operation,
  ): Promise<{ date: Date; amount: number }> {
    const user = await this.usersService.findUserById(userId);
    user.role = Role.Investor;
    await this.usersService.saveUser(user);
    const newInvestment = new Investment();
    newInvestment.amount = sum;
    newInvestment.date = new Date();
    newInvestment.user = user;
    newInvestment.type = type;
    newInvestment.amounts = await this.amountService.addAmount(newInvestment);
    const investment = await this.investmentRepository.save(newInvestment);
    await this.usersService.saveUser(user);
    return { date: investment.date, amount: investment.amount };
  }

  countTotal = (amounts: Investment[]): number => {
    return amounts.reduce((acc, i) => {
      return acc + i.amount;
    }, 0);
  };

  async getAmount(userId: string): Promise<{
    totalAmount: number;
    investments: Array<{
      amount: number;
      date: Date;
    }>;
  }> {
    const user = await this.usersService.findUserById(userId);
    const amounts = await this.investmentRepository.find({ where: { user } });
    const total = this.countTotal(amounts);
    // Add percents from invited friends
    return {
      totalAmount: total,
      investments: amounts.map((i) => {
        return {
          amount: i.amount,
          date: i.date,
        };
      }),
    };
  }

  getReferral(userId: string): { referral: string } {
    return { referral: `${process.env.URL}/auth/signup/?userId=${userId}` };
  }

  async deleteInvestment(userId: string): Promise<{
    totalAmount: number;
  }> {
    const user = await this.usersService.findUserById(userId);
    const balance = await this.amountService.findOne();
    const amounts = await this.investmentRepository.find({ where: { user } });
    const userTotal = this.countTotal(amounts);
    if (userTotal > balance.total) {
      throw new HttpException("You can't take your money for now", 400);
    }
    await this.investmentRepository.remove(amounts);
    balance.total = balance.total - userTotal;
    await this.amountService.saveAmount(balance);
    await this.investmentRepository.save(amounts);
    return { totalAmount: userTotal };
  }
}
