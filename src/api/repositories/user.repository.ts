import { IUser, USER_MODEL } from '../models';
import { ISession, SESSION_MODEL } from '../models/session.model';

export interface IUserRepository {
  findUserByEmail(email: string, withPassword?: boolean): Promise<IUser | null>;
  createUser(data: any): Promise<IUser>;
  createSession(data: any): Promise<ISession>;
  getUserActiveSessions(userId: string): Promise<ISession[] | null>;
  removeSessionById(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  async findUserByEmail(email: string, withPassword?: boolean): Promise<IUser | null> {
    try {
      if (withPassword) {
        return await USER_MODEL.findOne({ email }).select('+password');
      }
      return await USER_MODEL.findOne({ email });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Error finding user');
    }
  }

  async createUser(data: any): Promise<IUser> {
    try {
      const user = await USER_MODEL.create({
        name: data.name,
        email: data.email,
        password: data.password,
        planId: data.planId,
      });
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
    }
  }

  /**
   * SESSION MANAGEMENT
   */

  async createSession(data: any): Promise<ISession> {
    try {
      const session = await SESSION_MODEL.create({
        token: data.token,
        userId: data.userId,
        deviceInfo: data.deviceInfo,
        expiresAt: data.expiresAt,
      });
      return session;
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Error creating session');
    }
  }

  async getUserActiveSessions(userId: string): Promise<ISession[] | null> {
    try {
      const sessions = await SESSION_MODEL.find({ userId });
      return sessions;
    } catch (error) {
      console.error('Error retrieving user sessions:', error);
      throw new Error('Error retrieving active sessions');
    }
  }

  async removeSessionById(id: string): Promise<void> {
    try {
      await SESSION_MODEL.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error removing session by id:', error);
      throw new Error('Error removing session');
    }
  }
}
