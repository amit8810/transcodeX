import { InternalServerError } from '@src/errors';
import { UnauthorizedError } from '@src/errors/UnauthorizedError';
import { logger } from '@src/utils/logger';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

interface JwtPayload {
  id: ObjectId;
  email: string;
}

export class JwtService {
  private secret: string;
  private expiresIn: number | string;
  private static instance: JwtService | null = null;

  private constructor(secret: string, expiresIn: string) {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  public static getInstance(secret: string, expiresIn: string) {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService(secret, expiresIn);
    }
    return JwtService.instance;
  }

  sign(payload: JwtPayload): string {
    try {
      const options: SignOptions = { expiresIn: this.expiresIn as any };
      const token = jwt.sign(payload, this.secret as Secret, options);
      logger.info(`JWT signed for user: ${payload.id}`);
      return token;
    } catch (error: any) {
      logger.error(`JWT sign failed: ${error.message}`);
      throw new InternalServerError('Failed to generate JWT');
    }
  }

  verify(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as JwtPayload;
      logger.info(`JWT verified for user: ${decoded.id}`);
      return decoded;
    } catch (error: any) {
      logger.error(`JWT verification failed: ${error.message}`);
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Invalid token');
      }
      throw new InternalServerError('Failed to verify JWT');
    }
  }
}
