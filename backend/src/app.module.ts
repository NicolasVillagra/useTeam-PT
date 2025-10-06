import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './modules/tasks/tasks.module';
import { ColumnsModule } from './modules/columns/columns.module';
import { RealtimeGateway } from './realtime.gateway';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban-board'),
    TasksModule,
    ColumnsModule,
  ],
  providers: [RealtimeGateway],
})
export class AppModule {}
