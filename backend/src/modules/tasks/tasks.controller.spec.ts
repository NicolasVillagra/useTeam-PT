import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { RealtimeGateway } from '../../realtime.gateway';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;
  const gatewayMock = { server: { emit: jest.fn() } } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        { provide: TasksService, useValue: {
          findAll: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          remove: jest.fn(),
        } },
        { provide: RealtimeGateway, useValue: gatewayMock },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  it('findAll delega en service', async () => {
    (service.findAll as jest.Mock).mockResolvedValue([{ _id: '1' }]);
    const res = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(res).toEqual([{ _id: '1' }]);
  });

  it('create emite evento', async () => {
    (service.create as jest.Mock).mockResolvedValue({ _id: '1', title: 'A' });
    const res = await controller.create({ title: 'A' } as any);
    expect(service.create).toHaveBeenCalledWith({ title: 'A' });
    expect(gatewayMock.server.emit).toHaveBeenCalledWith('taskCreated', { _id: '1', title: 'A' });
    expect(res).toEqual({ _id: '1', title: 'A' });
  });

  it('update emite evento', async () => {
    (service.update as jest.Mock).mockResolvedValue({ _id: '1', title: 'B' });
    const res = await controller.update('1', { title: 'B' } as any);
    expect(service.update).toHaveBeenCalledWith('1', { title: 'B' });
    expect(gatewayMock.server.emit).toHaveBeenCalledWith('taskUpdated', { _id: '1', title: 'B' });
    expect(res).toEqual({ _id: '1', title: 'B' });
  });

  it('remove emite evento', async () => {
    (service.remove as jest.Mock).mockResolvedValue({ message: 'ok' });
    const res = await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith('1');
    expect(gatewayMock.server.emit).toHaveBeenCalledWith('taskDeleted', '1');
    expect(res).toEqual({ message: 'ok' });
  });
});
