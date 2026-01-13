import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseFactory } from './api-response.factory';
import { InvalidArgumentError } from '../exceptions/invalid-argument.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof InvalidArgumentError) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ApiResponseFactory.error(exception.message, 'BAD_REQUEST'));
    }

    if (
      exception instanceof Error &&
      (exception.name === 'UnauthorizedError' ||
        exception.message.toLowerCase().includes('invalid credentials') ||
        exception.message.toLowerCase().includes('unauthorized'))
    ) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ApiResponseFactory.error(exception.message, 'UNAUTHORIZED'));
    }

    if (exception instanceof Error && exception.message.includes('not found')) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json(ApiResponseFactory.error(exception.message, 'NOT_FOUND'));
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message =
        typeof response === 'object' ? (response as any).message : response;

      return res
        .status(status)
        .json(ApiResponseFactory.error(message, 'HTTP_ERROR'));
    }

    this.logger.error(`[Unhandled Error]`, exception);

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        ApiResponseFactory.error(
          'Internal server error',
          'INTERNAL_SERVER_ERROR',
        ),
      );
  }
}
