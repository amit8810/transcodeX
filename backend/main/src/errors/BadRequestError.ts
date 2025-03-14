import { logger } from '@src/utils/logger';
import { CustomError } from './CustomError';

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(400, message);
    logger.error(`BadRequestError: ${message}`);
  }
}
