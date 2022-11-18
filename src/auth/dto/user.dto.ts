import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: 'Username', nullable: true, required: true })
  username: string;

  @ApiProperty({ description: 'Password', nullable: false, required: true })
  password: string;
}
