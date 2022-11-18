import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AmountService } from 'src/amount/amount.service';
import { InvestService } from '../invest/invest.service';
import { UsersService } from '../users/users.service';
import { AmountType } from '../enums/amountType.enum';

@Injectable()
export class PercentsService {
  constructor(
    private investmentService: InvestService,
    private amountService: AmountService,
    private usersService: UsersService,
  ) {}
  private readonly logger = new Logger(PercentsService.name);

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async countDailyPercent() {
    const investments = await this.investmentService.getAllCurrentInvestments();
    let totalCounter = 0;
    investments.map(async (investment) => {
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

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async countUserPercent() {
    const inviters = await this.usersService.getAllInviters();
    const balance = await this.amountService.findOne();

    // Find all inviters
    inviters.map(async (inviter) => {
      const users = await this.usersService.getAllInvitedUsersByInviterId(
        inviter,
      );
      let totalDailyPercents = 0;

      // Find all invited users by inviters
      users.map(async (user) => {
        // Find all investments by invited user
        const investments = await this.investmentService.getInvestmentsByUser(
          user,
        );
        // Count all daily percents
        totalDailyPercents += investments.reduce(
          (acc, i) => acc + i.percents,
          0,
        );

        if (totalDailyPercents) {
          await this.investmentService.invest(
            inviter.userId,
            totalDailyPercents / 10,
            AmountType.Percent,
          );
          balance.total += totalDailyPercents;
          this.logger.debug(`${totalDailyPercents} percents was added`);
          totalDailyPercents = 0;
        }
      });
    });
    await this.amountService.saveAmount(balance);
  }
}
