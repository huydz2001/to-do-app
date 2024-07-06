import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ADMIN_ID } from '../constants';
import { GroupService, UserService } from 'src/app/services';
import { RequestService } from 'src/app/shared/service/request.service';

@Injectable()
export class AuthencationMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly requsetService: RequestService,
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
        req['user'] = payload.id;
        this.requsetService.setUserId(payload.id);
      } catch {
        throw new UnauthorizedException('Invalid Token');
      }
    } else {
      req['user'] = ADMIN_ID;
    }
    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
