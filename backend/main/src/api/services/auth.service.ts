import { BadRequestError, NotFoundError } from '@src/errors';
import { IUserRepository } from '../repositories/user.repository';
import { API_MESSAGES } from '@src/constants/apiMessages';
import { JwtService } from './jwt.service';
import { settings } from '@src/config/setting.config';
import { IUser } from '../models';

const jwtService = JwtService.getInstance(settings.jwt.SECRET, settings.jwt.EXPIRES_IN);

export interface IAuthService {
  register(data: any): Promise<any>;
  login(data: any): Promise<any>;
  getProfile(email: string):Promise<IUser|null>

}

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async register(data: any) {
    const isUserExist = await this.userRepository.findUserByEmail(data.email);
    if (isUserExist) {
      throw new BadRequestError(API_MESSAGES.USER.ALREADY_EXISTS);
    }

    const user = await this.userRepository.createUser(data);
    const userObj = JSON.parse(JSON.stringify(user));
    delete userObj.password;

    return userObj;
  }

  async login(data: any): Promise<any> {
    const user = await this.userRepository.findUserByEmail(data.email, true);
    if (!user) {
      throw new NotFoundError(API_MESSAGES.USER.NOT_FOUND_WITH_EMAIL);
    }

    if (!(await user.comparePassword(data.password))) {
      throw new BadRequestError(API_MESSAGES.AUTHENTICATION.INVALID_PASSWORD);
    }

    /**
     * Generate access token: JWT
     */
    const payload = { id: user?._id, email: user?.email };
    const token = jwtService.sign(payload);

    return { token, user: payload };
  }

  async getProfile(email: string): Promise<IUser | null>{
    const user = await this.userRepository.findUserByEmail(email);
    return user;
  }
}
