import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
} from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleDestroy, OnApplicationShutdown {
  getHello(): string {
    return 'Hello World!';
  }
  onModuleDestroy() {
    console.log('Module is being destroyed');
  }
  onApplicationShutdown(signal?: string) {
    console.log(`Application is shutting down with signal ${signal}`);
  }
}
