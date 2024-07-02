import { Field, Int, ObjectType } from '@nestjs/graphql';
import { STATUS_TASK } from 'src/app/common/constants';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseModel } from '../shared';
import { User } from './user.model';

@Entity({ name: 'tasks' })
@ObjectType()
export class Task extends BaseModel {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field({ nullable: false })
  task_name: string;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn()
  user: User;

  @Column()
  @Field({ nullable: false })
  start_date: Date;

  @Column()
  @Field({ nullable: false })
  start_time: string;

  @Column()
  @Field({ nullable: false })
  end_time: string;

  @Column()
  @Field({ nullable: false, defaultValue: STATUS_TASK.NOT_STARTED })
  status: number;

  @Column({ length: 100 })
  @Field({ nullable: false })
  desc: string;
}
