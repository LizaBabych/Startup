import {
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InvestService } from './invest.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../enums/role.enum';
import RoleGuard from '../auth/guards/roles.guard';

@Controller('invest')
export class InvestController {
  constructor(private readonly investmentService: InvestService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([Role.Investor, Role.User]))
  @Post()
  async invest(@Request() req) {
    return this.investmentService.invest(req.user.userId, req.body.amount);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.Investor))
  @Get()
  async getUserAmount(@Request() req) {
    return this.investmentService.getAmount(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.Investor))
  @Post('invite')
  async inviteUserById(@Request() req) {
    return this.investmentService.inviteFriend(
      req.user.userId,
      req.body.friendId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.Investor))
  @Delete()
  async takeAllEarnings(@Request() req) {
    return this.investmentService.deleteInvestment(req.user.userId);
  }
}
