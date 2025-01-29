import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConnectionService } from './config/mongodb-connection.service';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'NestJs-Blog',
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => Logger.log('MongoDB connected'));
        connection.on('disconnected', () => Logger.log('disconnected'));
        connection.on('reconnected', () => Logger.log('reconnected'));
        return connection;
      },
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, MongooseConnectionService],
})
export class AppModule {}
