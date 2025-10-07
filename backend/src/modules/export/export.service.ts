import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExportService {
  constructor() {}

  async exportBacklog(email: string, fields?: string[]): Promise<{ status: string; message: string }> {
    // Validar email
    const trimmedEmail = (email || '').trim();
    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      throw new HttpException('Email inválido', HttpStatus.BAD_REQUEST);
    }

    // Configurar URLs
    const webhookUrl = this.getWebhookUrl();
    const { tasksUrl, columnsUrl } = this.getBackendUrls();

    try {
      // Enviar solicitud a N8N
      await axios.post(webhookUrl, {
        email: trimmedEmail,
        fields: Array.isArray(fields) ? fields : undefined,
        sources: { tasksUrl, columnsUrl },
        requestedAt: new Date().toISOString(),
      });

      return { status: 'ok', message: 'Solicitud de exportación enviada' };
    } catch (err: any) {
      const status = err?.response?.status || 500;
      const data = err?.response?.data || err?.message || 'Error al contactar N8N';
      throw new HttpException(
        { message: 'No se pudo disparar el flujo N8N', details: data },
        status,
      );
    }
  }

  private getWebhookUrl(): string {
    return process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/kanban-export';
  }

  private getBackendUrls(): { tasksUrl: string; columnsUrl: string } {
    const backendBase = process.env.BACKEND_PUBLIC_URL || 'http://localhost:3001';
    return {
      tasksUrl: `${backendBase}/tasks`,
      columnsUrl: `${backendBase}/columns`,
    };
  }
}
