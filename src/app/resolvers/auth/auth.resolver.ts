import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateDataInput,
  CreateUserResponse,
  LoginDataInput,
} from 'src/app/dtos';
import { LoginResponse } from 'src/app/dtos/user/loginResponse.dto';
import { AuthService } from 'src/app/services';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query((returns) => LoginResponse)
  async login(@Args('req') req: LoginDataInput) {
    return await this.authService.login(req);
  }

  @Mutation((returns) => CreateUserResponse)
  async register(@Args('req') request: CreateDataInput) {
    return await this.authService.crateUser(request);
  }
}
