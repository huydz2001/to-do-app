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
import { User } from './user.entity';

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
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_task_user' })
  user: User;

  @Column({
    type: 'date',
  })
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

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true })
  desc?: string;

  constructor(item: Partial<Task>) {
    super();
    Object.assign(this, item);
  }
}
