import { BadRequestError } from '@src/errors';
import { IUserRepository } from '../repositories/user.repository';
import { API_MESSAGES } from '@src/constants/apiMessages';

export interface IAuthService {
  register(data: any): any;
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
}
