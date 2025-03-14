import { IUser, USER_MODEL } from '../models';

export interface IUserRepository {
  findUserByEmail(email: string): Promise<IUser | null>;
  createUser(data: any): Promise<IUser>;
}

export class UserRepository implements IUserRepository {
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await USER_MODEL.findOne({ email });
  }

  async createUser(data: any): Promise<IUser> {
    const user = await USER_MODEL.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    return user;
  }
}
