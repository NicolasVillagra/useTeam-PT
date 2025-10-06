import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './tasks.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async findAll() {
    return this.taskModel.find();
  }

  async create(data: any) {
    const task = new this.taskModel(data);
    return task.save();
  }

  async update(id: string, data: any) {
    return this.taskModel.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id: string) {
    return this.taskModel.findByIdAndDelete(id);
  }
}
