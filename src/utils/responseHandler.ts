import { STATUS_CODES } from '@src/constants/statusCodes';
import { Response } from 'express';
import { IApiResponse } from './apiResponse';
import { CustomError } from '@src/errors';

export class ResponseHandler<T> {
  private sendResponse(res: Response, statusCode: number, message: string, data: T) {
    const response: IApiResponse<T> = {
      success: statusCode >= 200 && statusCode < 300,
      statusCode,
      message,
      responseData: data,
    };
    res.status(statusCode).json(response);
  }

  private sendError(res: Response, message: string, err: CustomError | Error) {
    const response = {
      success: false,
      statusCode: err instanceof CustomError ? err.statusCode : 500,
      message: err instanceof CustomError ? err.message : message,
      stack: err.stack,
    };
    res.status(err instanceof CustomError ? err.statusCode : 500).json(response);
  }

  sendCreatedResponse(res: Response, message: string, data: T) {
    this.sendResponse(res, STATUS_CODES.CREATED, message, data);
  }

  sendSuccessResponse(res: Response, message: string, data: T) {
    this.sendResponse(res, STATUS_CODES.OK, message, data);
  }

  sendErrorResponse(res: Response, message: string, error: CustomError | Error) {
    this.sendError(res, message, error);
  }
}
