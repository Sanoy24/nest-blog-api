import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConnectionService } from './config/mongodb-connection.service';
import { Connection } from 'mongoose';
import { AuthenticationModule } from './authentication/authentication.module';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { TagModule } from './tag/tag.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => Logger.log('MongoDB connected'));
          connection.on('disconnected', () => Logger.log('disconnected'));
          connection.on('reconnected', () => Logger.log('reconnected'));
          return connection;
        },
      }),
    }),
    UsersModule,
    AuthenticationModule,
    CategoryModule,
    PostModule,
    CommentModule,
    LikeModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService, MongooseConnectionService],
})
export class AppModule {}
