import { IUser, USER_MODEL } from '../models';

export interface IUserRepository {
  findUserByEmail(email: string, withPassword?: boolean): Promise<IUser | null>;
  createUser(data: any): Promise<IUser>;
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
}
