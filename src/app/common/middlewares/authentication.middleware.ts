import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export class Authencation implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException('Invalid Token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
