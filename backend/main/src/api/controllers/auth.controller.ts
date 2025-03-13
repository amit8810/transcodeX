import { Request, Response } from 'express';
import { IAuthService } from '../services/auth.service';

export class AuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  async registerUser(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const name = `${firstName} ${lastName}`;

      // const user = await this.authService.register({ name, email, password })
    } catch (error) {}
  }
}
