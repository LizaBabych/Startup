import { Injectable } from '@nestjs/common';

@Injectable()
export class InviteService {
  getReferral(userId: string): { referral: string } {
    return { referral: `${process.env.URL}/auth/signup/?userId=${userId}` };
  }
}
