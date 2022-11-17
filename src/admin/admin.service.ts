import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InvestService } from '../invest/invest.service';
import { AmountService } from '../amount/amount.service';

@Injectable()
export class AdminService {
  constructor(
    private investmentService: InvestService,
    private usersService: UsersService,
    private amountService: AmountService,
  ) {}

  async getStatus(): Promise<{
    totalBalance: number;
    totalUsers: number;
  }> {
    const users = await this.usersService.findAllUsers();
    const balance = await this.amountService.findOne();
    return {
      totalBalance: balance.total,
      totalUsers: users.length,
    };
  }

  async takePartOfMoney(amount: number): Promise<{ rest: number }> {
    const totalBalance = await this.amountService.findOne();
    if (amount > totalBalance.total) {
      throw new HttpException('Money is not enough', 400);
    }
    totalBalance.total = totalBalance.total - amount;
    const result = await this.amountService.saveAmount(totalBalance);
    return { rest: result.total };
  }
}
