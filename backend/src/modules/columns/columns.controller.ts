import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ColumnsService } from './columns.service';

@Controller('columns')
export class ColumnsController {
  constructor(private service: ColumnsService) {}

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
      return await this.service.create(body);
    } catch (error) {
      // Los errores del service ya están formateados correctamente
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    try {
      return await this.service.update(id, body);
    } catch (error) {
      // Los errores del service ya están formateados correctamente
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.service.remove(id);
    } catch (error) {
      // Los errores del service ya están formateados correctamente
      throw error;
    }
  }
}
