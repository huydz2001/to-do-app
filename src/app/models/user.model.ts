import { Field, Int, ObjectType } from '@nestjs/graphql';
import { STATUS } from 'src/app/common/constants';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
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

  @ManyToOne(() => Group, (group) => group.members)
  @JoinColumn({
    name: 'group_id',
  })
  group: Group;

  @OneToMany(() => Task, (task) => task.user, { cascade: true })
  tasks: Task[];

  constructor(item: Partial<User>) {
    super();
    Object.assign(this, item);
  }
}
