import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiQuery({
    name: 'referral',
    required: false,
    description: 'Referral code',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exist',
  })
  @Post('signup')
  async signUp(@Body() user: UserDto, @Query() query) {
    return await this.authService.addUser(
      user.username,
      user.password,
      null,
      query.referral,
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User is not found',
  })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Body() body: UserDto) {
    return await this.authService.login(req.user);
  }
}
