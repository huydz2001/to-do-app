import { Global, Injectable } from '@nestjs/common';

@Injectable()
export class RequestService {
  public userId: number;

  setUserId(userId) {
    this.userId = userId;
  }

  getUserId() {
    return this.userId;
  }
}
