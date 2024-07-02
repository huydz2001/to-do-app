import { Module } from '@nestjs/common';
import { TaskResolver } from 'src/app/resolvers';

@Module({
  imports: [],
  providers: [TaskResolver],
})
export class TaskModule {}
