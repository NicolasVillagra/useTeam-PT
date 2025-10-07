import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  function MockTaskModel(this: any, data: any) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue({ _id: '1', ...data });
  }
  (MockTaskModel as any).find = jest.fn();
  (MockTaskModel as any).findByIdAndUpdate = jest.fn();
  (MockTaskModel as any).findByIdAndDelete = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getModelToken('Task'), useValue: MockTaskModel },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('findAll', () => {
    it('retorna tareas', async () => {
      (MockTaskModel as any).find.mockResolvedValue([{ _id: '1' }]);
      const res = await service.findAll();
      expect((MockTaskModel as any).find).toHaveBeenCalled();
      expect(res).toEqual([{ _id: '1' }]);
    });

    it('lanza InternalServerError en fallo', async () => {
      (MockTaskModel as any).find.mockRejectedValue(new Error('db'));
      await expect(service.findAll()).rejects.toHaveProperty('status', 500);
    });
  });

  describe('create', () => {
    it('valida data', async () => {
      await expect(service.create(null as any)).rejects.toHaveProperty('status', 400);
    });

    it('crea y guarda', async () => {
      const res = await service.create({ title: 'a' });
      expect(res).toEqual({ _id: '1', title: 'a' });
    });
  });

  describe('update', () => {
    it('valida id', async () => {
      await expect(service.update('' as any, {})).rejects.toHaveProperty('status', 400);
    });

    it('actualiza y retorna', async () => {
      (MockTaskModel as any).findByIdAndUpdate.mockResolvedValue({ _id: '1', title: 'b' });
      const res = await service.update('1', { title: 'b' });
      expect((MockTaskModel as any).findByIdAndUpdate).toHaveBeenCalledWith('1', { title: 'b' }, { new: true });
      expect(res).toEqual({ _id: '1', title: 'b' });
    });

    it('not found', async () => {
      (MockTaskModel as any).findByIdAndUpdate.mockResolvedValue(null);
      await expect(service.update('1', {})).rejects.toHaveProperty('status', 404);
    });
  });

  describe('remove', () => {
    it('valida id', async () => {
      await expect(service.remove('' as any)).rejects.toHaveProperty('status', 400);
    });

    it('elimina y retorna', async () => {
      (MockTaskModel as any).findByIdAndDelete.mockResolvedValue({ _id: '1' });
      const res = await service.remove('1');
      expect((MockTaskModel as any).findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(res).toEqual({ message: 'Tarea eliminada correctamente', deletedTask: { _id: '1' } });
    });

    it('not found', async () => {
      (MockTaskModel as any).findByIdAndDelete.mockResolvedValue(null);
      await expect(service.remove('1')).rejects.toHaveProperty('status', 404);
    });
  });
});
