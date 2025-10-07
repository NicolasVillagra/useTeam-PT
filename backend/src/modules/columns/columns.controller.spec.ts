import { Test, TestingModule } from '@nestjs/testing';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { RealtimeGateway } from '../../realtime.gateway';

describe('ColumnsController', () => {
  let controller: ColumnsController;
  let service: ColumnsService;
  const gatewayMock = { server: { emit: jest.fn() } } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColumnsController],
      providers: [
        { provide: ColumnsService, useValue: {
          ensureDefaults: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          remove: jest.fn(),
        } },
        { provide: RealtimeGateway, useValue: gatewayMock },
      ],
    }).compile();

    controller = module.get<ColumnsController>(ColumnsController);
    service = module.get<ColumnsService>(ColumnsService);
    jest.clearAllMocks();
  });

  it('findAll llama a ensureDefaults', async () => {
    (service.ensureDefaults as jest.Mock).mockResolvedValue([{ _id: '1' }]);
    const res = await controller.findAll();
    expect(service.ensureDefaults).toHaveBeenCalled();
    expect(res).toEqual([{ _id: '1' }]);
  });

  it('create emite evento y retorna columna', async () => {
    (service.create as jest.Mock).mockResolvedValue({ _id: '1', name: 'A' });
    const res = await controller.create({ name: 'A' });
    expect(service.create).toHaveBeenCalledWith({ name: 'A' });
    expect(gatewayMock.server.emit).toHaveBeenCalledWith('columnCreated', { _id: '1', name: 'A' });
    expect(res).toEqual({ _id: '1', name: 'A' });
  });

  it('update emite evento y retorna columna', async () => {
    (service.update as jest.Mock).mockResolvedValue({ _id: '1', name: 'B' });
    const res = await controller.update('1', { name: 'B' });
    expect(service.update).toHaveBeenCalledWith('1', { name: 'B' });
    expect(gatewayMock.server.emit).toHaveBeenCalledWith('columnUpdated', { _id: '1', name: 'B' });
    expect(res).toEqual({ _id: '1', name: 'B' });
  });

  it('remove emite evento y retorna resultado', async () => {
    (service.remove as jest.Mock).mockResolvedValue({ message: 'ok' });
    const res = await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith('1');
    expect(gatewayMock.server.emit).toHaveBeenCalledWith('columnDeleted', '1');
    expect(res).toEqual({ message: 'ok' });
  });
});
