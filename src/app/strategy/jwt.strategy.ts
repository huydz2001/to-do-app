import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
  // constructor(configService: ConfigService) {
  //   super(configService, {
  //     // add token for every request exclude login/register
  //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //     secretOrKey: configService.get<string>('JWT_SIGN_SECRET'),
  //   });
  // }
}
