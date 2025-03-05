import {
  ArgumentsHost,
  ExceptionFilter,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class GlobalExeceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    throw new Error('Method not implemented.');
  }
}
