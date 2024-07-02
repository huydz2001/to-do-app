import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: any, res: any, next: (error?: any) => void) {
    if (!req.header['x-api-key']) {
      throw new UnauthorizedException('Access Denied');
    }

    if (
      req.headers['x-api-key'] !== this.configService.get<string>('X_API_KEY')
    ) {
      throw new UnauthorizedException('Access Denied');
    }

    next();
  }
}
