import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Column } from './columns.schema';

@Injectable()
export class ColumnsService {
  constructor(@InjectModel(Column.name) private columnModel: Model<Column>) {}

  async findAll() {
    return this.columnModel.find().sort({ createdAt: 1 });
  }

  async create(data: Partial<Column>) {
    const col = new this.columnModel(data);
    return col.save();
  }

  async update(id: string, data: Partial<Column>) {
    return this.columnModel.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id: string) {
    return this.columnModel.findByIdAndDelete(id);
  }

  // Crea columnas por defecto si no existen
  async ensureDefaults() {
    const count = await this.columnModel.countDocuments();
    if (count > 0) return this.findAll();
    const defaults = [
      { name: 'To Do' },
      { name: 'In Progress' },
      { name: 'Done' },
    ];
    await this.columnModel.insertMany(defaults);
    return this.findAll();
  }
}
