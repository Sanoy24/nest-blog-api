import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class MongooseConnectionService implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    this.connection.once('connected', () => {
      console.log('MongoDB connected successfully!');
    });

    this.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    this.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected.');
    });
  }
}
