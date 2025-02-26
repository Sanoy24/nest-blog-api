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
import { HealthModule } from './health/health.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './Guard/jwt-auth.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => Logger.log('MongoDB connected'));
          connection.on('disconnected', () => Logger.log('disconnected'));
          connection.on('reconnected', () => Logger.log('reconnected'));
          return connection;
        },
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 6000, limit: 10 }],
    }),
    UsersModule,
    AuthenticationModule,
    CategoryModule,
    PostModule,
    CommentModule,
    LikeModule,
    TagModule,
    HealthModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MongooseConnectionService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
