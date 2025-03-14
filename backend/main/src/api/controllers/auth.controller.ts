import { Request, Response } from 'express';
import { IAuthService } from '../services/auth.service';
import { ResponseHandler } from '@src/utils/responseHandler';
import { API_MESSAGES } from '@src/constants/apiMessages';

const responseHandler = new ResponseHandler();

export class AuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  async registerUser(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const name = `${firstName} ${lastName}`;

      const user = await this.authService.register({ name, email, password });
      responseHandler.sendCreatedResponse(res, API_MESSAGES.USER.CREATED, user);
    } catch (error: any) {
      responseHandler.sendErrorResponse(res, 'Internal Server Error', error);
    }
  }
}
