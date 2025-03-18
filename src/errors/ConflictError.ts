import { logger } from '@src/utils/logger';
import { CustomError } from './CustomError';

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(409, message);
    logger.error(`ConflictError: ${message}`);
  }
}
