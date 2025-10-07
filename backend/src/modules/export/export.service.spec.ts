import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { ExportService } from './export.service';

jest.mock('axios');

describe('ExportService', () => {
  let service: ExportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExportService],
    }).compile();

    service = module.get<ExportService>(ExportService);
    jest.clearAllMocks();
  });

  describe('exportBacklog', () => {
    it('debe lanzar error si el email es inválido', async () => {
      await expect(service.exportBacklog('')).rejects.toBeInstanceOf(HttpException);
      await expect(service.exportBacklog('invalido')).rejects.toBeInstanceOf(HttpException);
    });

    it('debe postear al webhook y devolver ok', async () => {
      (axios.post as jest.Mock).mockResolvedValue({ status: 200 });

      process.env.N8N_WEBHOOK_URL = 'http://n8n/webhook';
      process.env.BACKEND_PUBLIC_URL = 'http://api:3001';

      const resp = await service.exportBacklog('test@example.com', ['title']);

      expect(axios.post).toHaveBeenCalledWith('http://n8n/webhook', expect.objectContaining({
        email: 'test@example.com',
        fields: ['title'],
        sources: {
          tasksUrl: 'http://api:3001/tasks',
          columnsUrl: 'http://api:3001/columns',
        },
      }));
      expect(resp).toEqual({ status: 'ok', message: 'Solicitud de exportación enviada' });
    });

    it('debe mapear errores de axios a HttpException', async () => {
      (axios.post as jest.Mock).mockRejectedValue({ response: { status: 502, data: 'bad gateway' } });
      await expect(service.exportBacklog('a@b.com')).rejects.toBeInstanceOf(HttpException);
    });
  });
});


