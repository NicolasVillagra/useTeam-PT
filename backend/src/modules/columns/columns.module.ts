import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Column, ColumnSchema } from './columns.schema';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { RealtimeGateway } from '../../realtime.gateway';


@Module({
  imports: [MongooseModule.forFeature([{ name: Column.name, schema: ColumnSchema }])],
  controllers: [ColumnsController],
  providers: [ColumnsService, RealtimeGateway],
  exports: [ColumnsService],
})
export class ColumnsModule {}
