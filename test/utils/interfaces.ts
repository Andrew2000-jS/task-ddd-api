export interface ApiTestResponse {
  statusCode: number;
  success: boolean;
  data: any;
  meta: Record<string, any>;
}

export interface ApiTest {
  create: (...data) => Promise<ApiTestResponse>;
}
