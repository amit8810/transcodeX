import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { logger } from '../../utils/logger';

// Type for validation sources
type ValidationSource = 'body' | 'query' | 'params';

export const validate = (
  schema: ObjectSchema,
  sources: ValidationSource[] = ['body'], // default to body
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Collect data from specified sources
    const dataToValidate: { [key: string]: any } = {};
    const errors: string[] = [];

    sources.forEach((source) => {
      let sourceData;
      switch (source) {
        case 'body':
          sourceData = req.body;
          break;
        case 'query':
          sourceData = req.query;
          break;
        case 'params':
          sourceData = req.params;
          break;
        default:
          return; // Skip invalid source
      }

      const { error, value } = schema.validate(sourceData, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        errors.push(`${source} validation failed: ${error.details.map((detail) => detail.message).join(', ')}`);
      } else {
        dataToValidate[source] = value;
      }
    });

    if (errors.length > 0) {
      const errorMessage = errors.join('; ');
      logger.error(`Validation failed: ${errorMessage}`);
      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errorMessage,
      });
      return;
    }

    // Update request object with validated data
    if (dataToValidate.body) req.body = dataToValidate.body;
    if (dataToValidate.query) req.query = dataToValidate.query;
    if (dataToValidate.params) req.params = dataToValidate.params;

    next();
  };
};
