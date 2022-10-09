import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.USER_NAME,
      password: process.env.PASSWORD,
      database: process.env.DB,
      synchronize: true,
      autoLoadEntities: true,
    }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
