import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/contexts/auth/infrastructure/guards/auth.guard';
import { MockAuthGuard } from './mocks';
import { DatabaseModule } from 'src/shared/contexts/infrastructure/database/database.module';
import { GlobalExceptionFilter } from 'src/shared/contexts/infrastructure/http/global-exception.filter';

export async function createTestingApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, DatabaseModule],
  })
    .overrideGuard(AuthGuard)
    .useClass(MockAuthGuard)
    .compile();

  const app = moduleFixture.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.init();
  return app;
}
