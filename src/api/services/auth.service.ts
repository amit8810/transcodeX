import { BadRequestError, ConflictError, NotFoundError } from '@src/errors';
import { IUserRepository } from '../repositories/user.repository';
import { API_MESSAGES } from '@src/constants/apiMessages';
import { JwtService } from './jwt.service';
import { settings } from '@src/config/setting.config';
import { IUser } from '../models';
import { PLAN_MODEL } from '../models';
import { v4 as uuid } from 'uuid';
import { EmailService } from './email.service';

const jwtService = JwtService.getInstance(settings.jwt.SECRET);
const emailService = EmailService.getInstance();

export interface IAuthService {
  register(data: any): Promise<any>;
  login(data: any): Promise<any>;
  removeSessionById(sessionId: string): Promise<void>;
  getProfile(email: string): Promise<IUser | null>;
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

    // send onboarding email
    await emailService.sendRegistrationEmail(user);

    return userObj;
  }

  async login(data: { email: string; password: string }): Promise<any> {
    const user = await this.userRepository.findUserByEmail(data.email, true);
    if (!user) {
      throw new NotFoundError(API_MESSAGES.USER.NOT_FOUND_WITH_EMAIL);
    }

    if (!(await user.comparePassword(data.password))) {
      throw new BadRequestError(API_MESSAGES.AUTHENTICATION.INVALID_PASSWORD);
    }

    // Get user plan details
    const userPlanId = user?.planId.toString();
    const plan = await PLAN_MODEL.findById(userPlanId);
    // console.log("user plan details", plan);

    // Now check user sessions according to active plan device limit
    const userId = user?._id.toString();
    const userSessions = await this.userRepository.getUserActiveSessions(userId);
    if (userSessions && userSessions.length >= plan?.deviceLimit!) {
      throw new ConflictError(API_MESSAGES.AUTHENTICATION.SESSION_CONFLICT);
    }

    const payload = { id: user?._id, email: user?.email };
    const jwtExpireTime = settings.jwt.EXPIRES_IN;
    const accessToken = jwtService.sign(payload, jwtExpireTime);

    const refreshTokenExpireTime = settings.jwt.REFRESH_TOKEN_EXPIRES_IN;
    const refreshToken = jwtService.sign(payload, refreshTokenExpireTime);

    // If all good, then create a new session for user.
    const randomID = uuid();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const sessionObj = {
      token: refreshToken,
      userId,
      deviceInfo: `Device-${randomID}`,
      expiresAt,
    };

    const newSession = await this.userRepository.createSession(sessionObj);

    return { token: accessToken, user: payload, sessionInfo: newSession };
  }

  async removeSessionById(sessionId: string) {
    await this.userRepository.removeSessionById(sessionId);
  }

  async getProfile(email: string): Promise<IUser | null> {
    const user = await this.userRepository.findUserByEmail(email);
    return user;
  }
}
