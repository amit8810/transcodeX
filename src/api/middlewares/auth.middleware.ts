import { settings } from '@src/config/setting.config';
import { JwtService } from '../services/jwt.service';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';

declare module 'express' {
  interface Request {
    user?: {
      id: ObjectId;
      email: string;
    };
  }
}

const jwtService = JwtService.getInstance(settings.jwt.SECRET);

export class AuthMiddleware {
  public static verifyJwt(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        res.status(401).json({
          success: false,
          message: 'No authorization token provided',
        });
        return;
      }

      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

      const decoded = jwtService.verify(token);
      req.user = decoded;

      next();
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({
          success: false,
          message: 'Invalid or expired token',
          error: error.message,
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Authentication error',
      });
      return;
    }
  }
}
