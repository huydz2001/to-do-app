export enum STATUS {
  NOT_JOIN = 0,
  JOINED = 1,
  CREATE = 2,
}

export enum STATUS_TASK {
  NOT_STARTED = 0,
  DOING = 1,
  DONE = 2,
  OVER = 3,
  REJECT = 4,
}

export const ADMIN_ID = 99;

export enum ROLE_GROUP {
  Admin = 99,
  Member = 0,
}

export enum TYPE_REQUEST {
  update = 'update',
  create = 'create',
  delete = 'delete',
}
