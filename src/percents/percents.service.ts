import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AmountService } from 'src/amount/amount.service';
import { InvestService } from '../invest/invest.service';

@Injectable()
export class PercentsService {
  constructor(
    private investmentService: InvestService,
    private amountService: AmountService,
  ) {}
  private readonly logger = new Logger(PercentsService.name);

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async handleCron() {
    const investments = await this.investmentService.getAllCurrentInvestments();
    let totalCounter = 0;
    investments.map((investment) => {
      const onePercent = investment.amount / 100;
      totalCounter += onePercent;
      investment.percents += onePercent;
    });
    await this.investmentService.saveInvestment(investments);
    const balance = await this.amountService.findOne();
    balance.total += totalCounter;
    await this.amountService.saveAmount(balance);
    this.logger.debug(`${totalCounter} percents was added`);
  }
}
