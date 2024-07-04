import { Field, Int, ObjectType } from '@nestjs/graphql';
import { STATUS } from 'src/app/common/constants';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseModel } from '../shared';
import { Group } from './group.model';
import { Task } from './task.model';

@Entity({ name: 'users' })
@ObjectType()
export class User extends BaseModel {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column({ unique: true })
  @Field({ nullable: false })
  user_name: string;

  @Column({ unique: true })
  @Field({ nullable: false })
  email: string;

  @Column()
  @Field({ nullable: false })
  password: string;

  @Column()
  @Field({
    nullable: true,
    defaultValue:
      'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1',
  })
  avatar?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  dob?: string;

  @Column()
  @Field({ nullable: true, defaultValue: STATUS.NOT_JOIN })
  status: number;

  @ManyToMany(() => Group, (group) => group.members)
  groups: Group[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  constructor(
    user_name: string,
    email: string,
    password: string,
    avatar?: string,
    dob?: string,
    status: number = STATUS.NOT_JOIN,
    isDelete?: boolean,
    created_at?: Date,
    created_by?: number,
    updated_at?: Date,
    updated_by?: number,
  ) {
    super();
    this.user_name = user_name;
    this.email = email;
    this.password = password;
    this.avatar =
      avatar ||
      'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1';
    this.dob = dob;
    this.status = status;
    this.isDelete = isDelete;
    this.created_at = created_at;
    this.created_by = created_by;
    this.updated_at = updated_at;
    this.updated_by = updated_by;
  }
}
