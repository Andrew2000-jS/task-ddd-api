export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string | number;
    message: string;
  };
  meta?: {
    timestamp: string;
    [key: string]: any;
  };
}
