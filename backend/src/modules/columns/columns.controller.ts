import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { RealtimeGateway } from '../../realtime.gateway';

@Controller('columns')
export class ColumnsController {
  constructor(private service: ColumnsService, private gateway: RealtimeGateway) {}

  @Get()
  async findAll() {
    try {
      return await this.service.ensureDefaults();
    } catch (error) {
      // Los errores del service ya están formateados correctamente
      throw error;
    }
  }

  @Post()
  async create(@Body() body: any) {
    try {
      const column = await this.service.create(body);
      this.gateway.server.emit('columnCreated', column);
      return column;
    } catch (error) {
      // Los errores del service ya están formateados correctamente
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    try {
      const column = await this.service.update(id, body);
      this.gateway.server.emit('columnUpdated', column);
      return column;
    } catch (error) {
      // Los errores del service ya están formateados correctamente
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.service.remove(id);
      this.gateway.server.emit('columnDeleted', id);
      return result;
    } catch (error) {
      // Los errores del service ya están formateados correctamente
      throw error;
    }
  }
}
