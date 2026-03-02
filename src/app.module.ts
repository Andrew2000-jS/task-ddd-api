import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './contexts/tasks/infrastructure/task.module';
import { UserModule } from './contexts/users/infrastructure/user.module';
import { AuthModule } from './contexts/auth/infrastructure/auth.module';
import { DatabaseModule } from './shared/contexts/infrastructure/database/database.module';
import { MessengerModule } from './shared/contexts/infrastructure/messenger/messenger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    MessengerModule,
    AuthModule,
    TaskModule,
    UserModule,
  ],
})
export class AppModule {}
