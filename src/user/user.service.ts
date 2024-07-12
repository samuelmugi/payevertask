import { Injectable } from "@nestjs/common";
import { User } from "./schemas/user.schema";
import axios from "axios";
import * as fs from "fs";
import * as crypto from "crypto";
import { CreateUserDto } from "./dto/user.dto";
import { UserRepository } from "./repository/user.repository";
import { ReqresUserDetailsDto } from "./dto/reqres-user-dets.dto";
import { AvatarRepository } from "./repository/avatar.repository";
import { AvatarDto } from "./dto/avatar.dto";
import { Avatar } from "./schemas/avatar.schema";
import { MessagingService } from "../rabbitmq/messaging.service";

@Injectable()
export class UserService {
  constructor(
    private readonly messagingService: MessagingService,
    private readonly userRepository: UserRepository,
    private readonly avatarRepository: AvatarRepository) {
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(createUserDto);
    this.sendEmail();
    this.sendRabbitEvent(user);
    return user;
  }

  async getUser(userId: string): Promise<ReqresUserDetailsDto> {
    const response = await axios.get(`https://reqres.in/api/users/${userId}`);
    return response.data.data;
  }

  async getUserAvatar(userId: string): Promise<string> {
    const avatar = await this.avatarRepository.findByUserId(userId);
    console.log(avatar);
    if (avatar && avatar.avatarHash) {
      return fs.readFileSync(`./avatars/${avatar.avatarHash}`, "base64");
    } else {
      const response = await axios.get(`https://reqres.in/api/users/${userId}`);
      const avatarUrl = response.data.data.avatar;
      const avatarResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" });
      const hash = crypto.createHash("md5").update(avatarResponse.data).digest("hex");
      fs.writeFileSync(`./avatars/${hash}`, avatarResponse.data);
      await this.persistAvatar(avatar, { avatar: avatarUrl, userId: userId, avatarHash: hash });
      return avatarResponse.data.toString("base64");
    }
  }

  async persistAvatar(avatar: Avatar, avatarDto: AvatarDto) {
    if (avatar) {
      await this.avatarRepository.findByUserIdAndUpdate(avatarDto.userId, avatarDto);
    } else {
      await this.avatarRepository.create(avatarDto);
    }
  }


  async deleteUserAvatar(userId: string): Promise<void> {
    const avatar = await this.avatarRepository.findByUserId(userId);
    if (avatar && avatar.avatarHash) {
      this.deleteAvatarFile(avatar.avatarHash);
      await this.avatarRepository.findByUserIdAndUpdate(userId, { avatarHash: null });
    }
  }

  private deleteAvatarFile(avatarHash: string) {
    try {
      fs.unlinkSync(`./avatars/${avatarHash}`);
    } catch (e) {
      console.error("Error deleting avatar", e.message);
    }
  }

  private sendEmail() {
    // Dummy email sending logic
    console.log("Sending email...");
  }

  private sendRabbitEvent(user: User) {
    console.log("Sending RabbitMQ event ...");
    const pattern = "user_created";
    this.messagingService.sendMessage(pattern, user);
    console.log("RabbitMQ event sent");

  }
}
