import { Module } from '@nestjs/common';
import { InvestController } from './invest.controller';
import { InvestService } from './invest.service';
import { Investment } from '../entities/investment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmountModule } from '../amount/amount.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Investment]), AmountModule, UsersModule],
  providers: [InvestService],
  controllers: [InvestController],
  exports: [InvestService],
})
export class InvestModule {}
