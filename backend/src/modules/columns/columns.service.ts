import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Column } from './columns.schema';

@Injectable()
export class ColumnsService {
  constructor(@InjectModel(Column.name) private columnModel: Model<Column>) {}

  async findAll() {
    try {
      return await this.columnModel.find().sort({ createdAt: 1 });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las columnas');
    }
  }

  async create(data: Partial<Column>) {
    try {
      if (!data || typeof data !== 'object') {
        throw new BadRequestException('Datos de columna inválidos');
      }

      if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        throw new BadRequestException('El nombre de la columna es requerido');
      }

      const col = new this.columnModel(data);
      return await col.save();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear la columna');
    }
  }

  async update(id: string, data: Partial<Column>) {
    try {
      if (!id || typeof id !== 'string') {
        throw new BadRequestException('ID de columna inválido');
      }

      if (!data || typeof data !== 'object') {
        throw new BadRequestException('Datos de actualización inválidos');
      }

      const column = await this.columnModel.findByIdAndUpdate(id, data, { new: true });
      
      if (!column) {
        throw new NotFoundException('Columna no encontrada');
      }

      return column;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar la columna');
    }
  }

  async remove(id: string) {
    try {
      if (!id || typeof id !== 'string') {
        throw new BadRequestException('ID de columna inválido');
      }

      const column = await this.columnModel.findByIdAndDelete(id);
      
      if (!column) {
        throw new NotFoundException('Columna no encontrada');
      }

      return { message: 'Columna eliminada correctamente', deletedColumn: column };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar la columna');
    }
  }

  // SE CREAN COLUMNAS POR DEFECTO
  async ensureDefaults() {
    try {
      const count = await this.columnModel.countDocuments();
      if (count > 0) return await this.findAll();
      
      const defaults = [
        { name: 'To Do' },
        { name: 'In Progress' },
        { name: 'Done' },
      ];
      
      await this.columnModel.insertMany(defaults);
      return await this.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error al inicializar columnas por defecto');
    }
  }
}
