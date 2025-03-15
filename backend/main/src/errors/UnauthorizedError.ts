import { logger } from '@src/utils/logger';
import { CustomError } from './CustomError';

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
    logger.error(`Unauthorized Error: ${message}`);
  }
}
