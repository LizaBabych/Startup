import { Module } from '@nestjs/common';
import { AmountService } from './amount.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amount } from '../entities/amount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Amount])],
  providers: [AmountService],
  exports: [AmountService],
})
export class AmountModule {}
