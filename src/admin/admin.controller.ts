import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../enums/role.enum';
import RoleGuard from '../auth/guards/roles.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.Admin))
  @Get('status')
  async getStatus() {
    return this.adminService.getStatus();
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.Admin))
  @Post('take-part')
  async getUserAmount(@Request() req) {
    return this.adminService.takePartOfMoney(req.body.amount);
  }
}
