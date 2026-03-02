import { ApiResponse } from './api-response.interface';

export class ApiResponseFactory {
  static success<T>(data: T, meta?: any): ApiResponse<T> {
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }

  static error(message: string, code = 'INTERNAL_ERROR'): ApiResponse<null> {
    return {
      success: false,
      error: {
        code,
        message,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
