import { ApiProperty } from '@nestjs/swagger';

export class AmountDto {
  @ApiProperty({ description: 'Amount', nullable: false, required: true })
  amount: number;
}
