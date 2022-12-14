import { ApiProperty } from '@nestjs/swagger';

export class InvestmentDto {
  @ApiProperty({ description: 'Amount', nullable: false, required: true })
  amount: number;
}
