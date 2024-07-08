import { ForbiddenError } from '@nestjs/apollo';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from 'src/app/services';
import { ADMIN_ID } from '../constants';
import { RequestService } from 'src/app/shared';

@Injectable()
export class AuthencationMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private requsetService: RequestService,
    private readonly authService: AuthService,
  ) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    const isAuth =
      req.body.operationName == 'Login' || req.body.operationName == 'Register';

    if (!isAuth) {
      const token = this.extractTokenFromHeader(req);
      if (!token) {
        throw new UnauthorizedException('Invalid Token');
      }

      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SIGN_SECRET'),
        });

        const refreshToken = await this.authService.getTokenByUserId(
          payload.id,
        );

        if (!refreshToken) {
          throw new ForbiddenError('Access denied');
        }

        req['user'] = payload.id;
        this.requsetService.setUserId(payload.id);
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid Token');
        } else if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token has expired');
        }
      }
    } else {
      req['user'] = ADMIN_ID;
      this.requsetService.setUserId(ADMIN_ID);
    }
    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
