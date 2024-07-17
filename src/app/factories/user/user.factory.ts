import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { STATUS } from 'src/app/common/constants';
import { CreateDataInput } from 'src/app/dtos';
import { User } from 'src/app/entities';

@Injectable()
export class UserFactory {
  async convertCreateRequestInputToModel(user: CreateDataInput): Promise<User> {
    const hashPass = await this.hashPassword(user.password);
    return {
      id: null,
      name: user.name,
      email: user.email,
      password: hashPass,
      avatar:
        'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1',
      dob: null,
      status: STATUS.NOT_JOIN,
      group: null,
      tasks: [],
      isDelete: null,
      created_at: null,
      updated_at: null,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
