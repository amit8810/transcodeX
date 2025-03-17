import { IUser, USER_MODEL } from '../models';
import {ISession, SESSION_MODEL } from '../models/session.model';

export interface IUserRepository {
  findUserByEmail(email: string, withPassword?: boolean): Promise<IUser | null>;
  createUser(data: any): Promise<IUser>;
  createSession(data: any): Promise<ISession>;
  getUserActiveSessions(userId: string): Promise<ISession[]| null> 

}

export class UserRepository implements IUserRepository {
  async findUserByEmail(email: string, withPassword?: boolean): Promise<IUser | null> {
    if(withPassword){
      return await USER_MODEL.findOne({ email }).select("+password");
    }
    return await USER_MODEL.findOne({ email })
  }

  async createUser(data: any): Promise<IUser> {
    const user = await USER_MODEL.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    return user;
  }

  /**
   * SESSION MANAGEMENT
   */

  async createSession(data: any): Promise<ISession>{
    const session =  await SESSION_MODEL.create({
      token: data.token,
      userId: data.userId,
      deviceInfo: data.deviceInfo,
      expiresAt: data.expiresAt,
    })

    return session;
  }

  async getUserActiveSessions(userId: string): Promise<ISession[] | null>{
    const sessions = await SESSION_MODEL.find({ userId });
    return sessions;
  }
}
