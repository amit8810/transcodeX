import { CustomError } from './CustomError';
import { logger } from '@src/utils/logger';

export class NotFoundError extends CustomError {
  constructor(message: string = 'Not Found') {
    super(404, message);
    logger.error(`NotFoundError: ${message}`);
  }
}
