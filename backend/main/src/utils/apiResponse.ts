export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  responseData: T;
}

export class ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  responseData: T;

  constructor(statusCode: number, message: string, data: T) {
    this.success = statusCode >= 200 && statusCode < 300;
    (this.statusCode = statusCode), (this.message = message), (this.responseData = data);
  }
}
