import { NestMiddleware } from '@nestjs/common';

export class ApiKeyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {}
}
