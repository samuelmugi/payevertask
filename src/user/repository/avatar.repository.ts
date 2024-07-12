import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Avatar } from "../schemas/avatar.schema";
import { AvatarDto } from "../dto/avatar.dto";

@Injectable()
export class AvatarRepository {
  constructor(@InjectModel(Avatar.name) private avatarModel: Model<Avatar>) {}

  async create(avatarDto: AvatarDto): Promise<Avatar> {
    const avatar = new this.avatarModel(avatarDto);
    return avatar.save();
  }


  async findByUserId(userId: string): Promise<Avatar | null> {
    return this.avatarModel.findOne({ userId }).exec();
  }



  async findByUserIdAndUpdate(userId: string, update: Partial<Avatar>): Promise<Avatar | null> {
    return this.avatarModel.findOneAndUpdate({ userId }, update, { new: true }).exec();
  }
}
