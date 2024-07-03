import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { STATUS } from 'src/app/common/constants';
import { CreateDataInput } from 'src/app/dtos';
import { User } from 'src/app/models';

@Injectable()
export class UserFactory {
  async convertCreateRequestInputToModel(user: CreateDataInput): Promise<User> {
    const hashPass = await this.hashPassword(user.password);
    return new User(
      user.user_name,
      user.email,
      hashPass,
      'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1',
      null,
      STATUS.NOT_JOIN,
      null,
      null,
      null,
      null,
      null,
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
