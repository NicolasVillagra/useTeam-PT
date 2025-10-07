import { Body, Controller, Post } from '@nestjs/common';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('backlog')
  async exportBacklog(@Body() body: { email?: string; fields?: string[] }) {
    return this.exportService.exportBacklog(body.email || '', body.fields);
  }
}
