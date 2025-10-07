import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './tasks.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async findAll() {
    try {
      return await this.taskModel.find();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las tareas');
    }
  }

  async create(data: any) {
    try {
      if (!data || typeof data !== 'object') {
        throw new BadRequestException('Datos de tarea inválidos');
      }

      const task = new this.taskModel(data);
      return await task.save();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear la tarea');
    }
  }

  async update(id: string, data: any) {
    try {
      if (!id || typeof id !== 'string') {
        throw new BadRequestException('ID de tarea inválido');
      }

      if (!data || typeof data !== 'object') {
        throw new BadRequestException('Datos de actualización inválidos');
      }

      const task = await this.taskModel.findByIdAndUpdate(id, data, { new: true });
      
      if (!task) {
        throw new NotFoundException('Tarea no encontrada');
      }

      return task;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar la tarea');
    }
  }

  async remove(id: string) {
    try {
      if (!id || typeof id !== 'string') {
        throw new BadRequestException('ID de tarea inválido');
      }

      const task = await this.taskModel.findByIdAndDelete(id);
      
      if (!task) {
        throw new NotFoundException('Tarea no encontrada');
      }

      return { message: 'Tarea eliminada correctamente', deletedTask: task };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar la tarea');
    }
  }
}
