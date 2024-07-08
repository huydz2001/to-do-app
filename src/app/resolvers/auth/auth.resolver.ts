import { Res } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateDataInput,
  CreateUserResponse,
  LoginDataInput,
  LogoutResponse,
  RefreshTokenResponse,
} from 'src/app/dtos';
import { LoginResponse } from 'src/app/dtos/user/loginResponse.dto';
import { AuthService } from 'src/app/services';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query((returns) => LoginResponse)
  async login(
    @Args('req') req: LoginDataInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(req, res);
  }

  @Mutation((returns) => CreateUserResponse)
  async register(@Args('req') request: CreateDataInput) {
    return await this.authService.crateUser(request);
  }

  @Mutation((returns) => RefreshTokenResponse)
  async refreshToken(@Args('token') token: string) {
    return await this.authService.refreshToken(token);
  }

  @Mutation((returns) => LogoutResponse)
  async logOut(@Args('userId', { type: () => Int }) id: number) {
    return await this.authService.logOut(id);
  }
}
