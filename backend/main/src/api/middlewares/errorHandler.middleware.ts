import { Request, Response } from 'express';
import { CustomError } from '../../errors/CustomError';
import { logger } from '@src/utils/logger';

export const errorHandler = (err: Error, _: Request, res: Response): void => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      error: err.name,
    });
  } else {
    logger.error(`Unhandled error: ${err.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error: 'InternalServerError',
    });
  }
};
