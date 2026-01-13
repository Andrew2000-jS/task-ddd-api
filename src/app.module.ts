import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './contexts/tasks/infrastructure/task.module';
import { UserModule } from './contexts/users/infrastructure/user.module';
import { AuthModule } from './contexts/auth/infrastructure/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    TaskModule,
    UserModule,
  ],
})
export class AppModule {}
