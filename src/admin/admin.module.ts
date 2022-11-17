import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { InvestModule } from '../invest/invest.module';
import { AmountModule } from '../amount/amount.module';

@Module({
  imports: [UsersModule, InvestModule, AmountModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
