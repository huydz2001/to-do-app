import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { GroupService, UserService } from 'src/app/services';

@Injectable()
export class RoleGroupAuth implements CanActivate {
  private readonly logger = new Logger(RoleGroupAuth.name);
  constructor(private userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);

    const [, { req }] = context.getArgs();

    const userLogin = ctx.getContext().req.user;

    const userpromise = this.userService.findUserAdmin(userLogin);

    const isSuccess = userpromise.then((result) => {
      if (result) {
        return true;
      }
      return false;
    });

    return isSuccess.then((result) => {
      return result;
    });
  }
}
