import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(userDto);
    return createdUser.save();
  }

  async findById(userId: string): Promise<User> {
    return this.userModel.findById(userId);
  }

  async updateById(userId: string, update: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, update, { new: true });
  }
}
