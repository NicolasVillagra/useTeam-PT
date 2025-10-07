import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { RealtimeGateway } from '../../realtime.gateway';

@Controller('tasks')
export class TasksController {
  constructor(private service: TasksService, private gateway: RealtimeGateway) {}

  @Get()
  async findAll() {
    try {
      return await this.service.findAll();
    } catch (error) {
      // Los errores del service ya están formateados correctamente
      throw error;
    }
  }

  @Post()
  async create(@Body() body) {
    try {
      const task = await this.service.create(body);
      this.gateway.server.emit('taskCreated', task);
      return task;
    } catch (error) {
      // Los errores del service ya están formateados correctamente
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body) {
    try {
      const task = await this.service.update(id, body);
      this.gateway.server.emit('taskUpdated', task);
      return task;
    } catch (error) {
      // Los errores del service ya están formateados correctamente
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.service.remove(id);
      this.gateway.server.emit('taskDeleted', id);
      return result;
    } catch (error) {
      // Los errores del service ya están formateados correctamente
      throw error;
    }
  }
}
