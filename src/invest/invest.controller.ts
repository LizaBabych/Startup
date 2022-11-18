import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InvestService } from './invest.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../enums/role.enum';
import RoleGuard from '../auth/guards/roles.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvestmentDto } from './dto/investment.dto';
import { Investment } from '../entities/investment.entity';

@ApiTags('Invest')
@Controller('invest')
export class InvestController {
  constructor(private readonly investmentService: InvestService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([Role.Investor, Role.User]))
  @Post()
  async invest(@Request() req, @Body() body: InvestmentDto) {
    return this.investmentService.invest(req.user.userId, body.amount);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: Investment,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.Investor))
  @Get()
  async getUserAmount(@Request() req) {
    return this.investmentService.getAmount(req.user.userId);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.Investor))
  @Delete()
  async takeAllEarnings(@Request() req) {
    return this.investmentService.deleteInvestment(req.user.userId);
  }
}
