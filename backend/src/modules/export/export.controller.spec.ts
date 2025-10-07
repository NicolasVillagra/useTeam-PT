import { Test, TestingModule } from '@nestjs/testing';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';

describe('ExportController', () => {
  let controller: ExportController;
  let service: ExportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportController],
      providers: [
        {
          provide: ExportService,
          useValue: {
            exportBacklog: jest.fn().mockResolvedValue({ status: 'ok' }),
          },
        },
      ],
    }).compile();

    controller = module.get<ExportController>(ExportController);
    service = module.get<ExportService>(ExportService);
  });

  it('debe delegar a ExportService.exportBacklog', async () => {
    const result = await controller.exportBacklog({ email: 'a@b.com', fields: ['x'] });
    expect(service.exportBacklog).toHaveBeenCalledWith('a@b.com', ['x']);
    expect(result).toEqual({ status: 'ok' });
  });
});


