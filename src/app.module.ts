import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { config } from './configuration/config';
import { UsersModule } from './users/users.module';
import { InvestModule } from './invest/invest.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investment } from './entities/investment.entity';
import { User } from './entities/user.entity';
import { AdminModule } from './admin/admin.module';
import { Amount } from './entities/amount.entity';
import { AmountModule } from './amount/amount.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PercentsService } from './percents/percents.service';

@Module({
  imports: [
    ConfigModule.forRoot(config),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: +process.env.PORT,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [User, Investment, Amount],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    InvestModule,
    AdminModule,
    AmountModule,
  ],
  controllers: [AppController],
  providers: [AppService, PercentsService],
})
export class AppModule {}
