import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      message: 'Routine Flow API is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
