import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConnectionService } from './config/mongodb-connection.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'NestJs-Blog',
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('MongoDB connected');
        });
        connection.on('error', (error: any) => {
          console.log('MongoDB connection error:', error);
        });
        return connection;
      },
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, MongooseConnectionService],
})
export class AppModule {}
