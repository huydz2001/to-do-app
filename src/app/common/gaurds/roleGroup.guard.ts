import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { GroupService } from 'src/app/services';

@Injectable()
export class RoleGroupAuth implements CanActivate {
  private readonly logger = new Logger(RoleGroupAuth.name);
  constructor(private groupService: GroupService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    // const { req } = ctx.getContext();

    const [, { req }] = context.getArgs();

    const userLogin = ctx.getContext().req.user;

    const groupPromise = this.groupService.findByUserId(req.user);

    const isSuccess = groupPromise.then((group) => {
      if (group.members.filter((x) => x.id == userLogin)) {
        return true;
      }
      return false;
    });

    return isSuccess;
  }
}
