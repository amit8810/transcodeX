import { logger } from '@src/utils/logger';
import { CustomError } from './CustomError';

export class InternalServerError extends CustomError {
  constructor(message: 'Internal Server Error') {
    super(500, message);
    logger.error(`InternalServerError: ${message}`);
  }
}
