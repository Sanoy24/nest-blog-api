import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  MongooseHealthIndicator, // Import the correct indicator
} from '@nestjs/terminus';
import { Public } from 'src/shared/utils/publicRoute'; // If applicable

@Public() // If applicable
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: MongooseHealthIndicator, // Use MongooseHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'server',
          'https://nest-blog-api-2ael.onrender.com',
        ),
      () => this.db.pingCheck('database'), // Use the pingCheck method
    ]);
  }
}
