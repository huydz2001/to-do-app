import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: any, res: any, next: (error?: any) => void) {
    const listCheck = ['Login', 'Register', 'RefreshToken'];
    const isAuth = listCheck.includes(req.body.operationName);
    if (
      (!req.headers['x-api-key'] ||
        req.headers['x-api-key'] !==
          this.configService.get<string>('X_API_KEY')) &&
      !isAuth
    ) {
      throw new ForbiddenException('Access Denied');
    }

    next();
  }
}
