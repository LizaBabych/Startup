import { Role } from '../../enums/role.enum';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

const RoleGuard = (role: Role | Role[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      if (Array.isArray(role)) {
        return role.some((r) => r === user?.role);
      }
      return user?.role === role;
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;
