import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { RealtimeGateway } from '../../realtime.gateway';

@Controller('tasks')
export class TasksController {
  constructor(private service: TasksService, private gateway: RealtimeGateway) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() body) {
    const task = await this.service.create(body);
    this.gateway.server.emit('taskCreated', task);
    return task;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body) {
    const task = await this.service.update(id, body);
    this.gateway.server.emit('taskUpdated', task);
    return task;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.service.remove(id);
    this.gateway.server.emit('taskRemoved', id);
    return result;
  }
}
