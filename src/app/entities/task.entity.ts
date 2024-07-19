import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
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

  @Column({ nullable: false })
  @Field({ nullable: false })
  name: string;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_task_user' })
  user: User;

  @Column({
    type: 'date',
  })
  @Field({ nullable: false })
  start_date: string;

  @Column({
    type: 'timestamptz',
  })
  @Field((type) => Date, { nullable: false })
  start_time: Date;

  @Column({
    type: 'timestamptz',
  })
  @Field({ nullable: false })
  end_time: Date;

  @Column()
  @Field({ nullable: false, defaultValue: STATUS_TASK.NOT_STARTED })
  status: number;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true })
  desc?: string;

  @Column({ nullable: false })
  @Field((type) => Int)
  created_by: number;

  constructor(item: Partial<Task>) {
    super();
    Object.assign(this, item);
  }
}
