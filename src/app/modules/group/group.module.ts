import { Module } from '@nestjs/common';
import { GroupResolver } from 'src/app/resolvers';

@Module({
  imports: [],
  providers: [GroupResolver],
})
export class GroupModule {}
