import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ColumnsService } from './columns.service';

describe('ColumnsService', () => {
  let service: ColumnsService;
  // Creamos un mock que sea constructor (usable con `new`)
  function MockColumnModel(this: any, data: any) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue({ _id: '1', ...data });
  }
  // Métodos estáticos del modelo
  (MockColumnModel as any).find = jest.fn().mockReturnThis();
  (MockColumnModel as any).sort = jest.fn();
  (MockColumnModel as any).countDocuments = jest.fn();
  (MockColumnModel as any).insertMany = jest.fn();
  (MockColumnModel as any).findByIdAndUpdate = jest.fn();
  (MockColumnModel as any).findByIdAndDelete = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColumnsService,
        { provide: getModelToken('Column'), useValue: MockColumnModel },
      ],
    }).compile();

    service = module.get<ColumnsService>(ColumnsService);
  });

  describe('findAll', () => {
    it('retorna columnas ordenadas', async () => {
      (MockColumnModel as any).sort.mockResolvedValue([{ _id: '1', name: 'A' }]);
      const result = await service.findAll();
      expect((MockColumnModel as any).find).toHaveBeenCalled();
      expect((MockColumnModel as any).sort).toHaveBeenCalledWith({ createdAt: 1 });
      expect(result).toEqual([{ _id: '1', name: 'A' }]);
    });

    it('lanza InternalServerError en fallas', async () => {
      (MockColumnModel as any).sort.mockRejectedValue(new Error('db error'));
      await expect(service.findAll()).rejects.toHaveProperty('status', 500);
    });
  });

  describe('create', () => {
    it('valida nombre requerido', async () => {
      await expect(service.create({} as any)).rejects.toHaveProperty('status', 400);
    });

    it('crea y guarda una columna', async () => {
      const saved = await service.create({ name: 'Col' } as any);
      expect(saved).toEqual({ _id: '1', name: 'Col' });
    });
  });

  describe('update', () => {
    it('valida id requerido', async () => {
      await expect(service.update('' as any, {})).rejects.toHaveProperty('status', 400);
    });

    it('actualiza y retorna columna', async () => {
      (MockColumnModel as any).findByIdAndUpdate.mockResolvedValue({ _id: '1', name: 'X' });
      const res = await service.update('1', { name: 'X' } as any);
      expect((MockColumnModel as any).findByIdAndUpdate).toHaveBeenCalledWith('1', { name: 'X' }, { new: true });
      expect(res).toEqual({ _id: '1', name: 'X' });
    });

    it('lanza NotFound si no existe', async () => {
      (MockColumnModel as any).findByIdAndUpdate.mockResolvedValue(null);
      await expect(service.update('1', {} as any)).rejects.toHaveProperty('status', 404);
    });
  });

  describe('remove', () => {
    it('valida id', async () => {
      await expect(service.remove('' as any)).rejects.toHaveProperty('status', 400);
    });

    it('elimina y devuelve resultado', async () => {
      (MockColumnModel as any).findByIdAndDelete.mockResolvedValue({ _id: '1' });
      const res = await service.remove('1');
      expect((MockColumnModel as any).findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(res).toEqual({ message: 'Columna eliminada correctamente', deletedColumn: { _id: '1' } });
    });

    it('lanza NotFound si no existe', async () => {
      (MockColumnModel as any).findByIdAndDelete.mockResolvedValue(null);
      await expect(service.remove('1')).rejects.toHaveProperty('status', 404);
    });
  });

  describe('ensureDefaults', () => {
    it('retorna findAll si ya hay columnas', async () => {
      (MockColumnModel as any).countDocuments.mockResolvedValue(2);
      (MockColumnModel as any).sort.mockResolvedValue([{ _id: '1' }]);
      const res = await service.ensureDefaults();
      expect(res).toEqual([{ _id: '1' }]);
    });

    it('inserta defaults si no hay columnas', async () => {
      (MockColumnModel as any).countDocuments.mockResolvedValue(0);
      (MockColumnModel as any).insertMany.mockResolvedValue(undefined);
      (MockColumnModel as any).sort.mockResolvedValue([{ _id: '1' }, { _id: '2' }]);
      const res = await service.ensureDefaults();
      expect((MockColumnModel as any).insertMany).toHaveBeenCalled();
      expect(res).toEqual([{ _id: '1' }, { _id: '2' }]);
    });
  });
});
