import { IsNotEmpty, IsString } from "class-validator";

export class AvatarDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
  @IsString()
  @IsNotEmpty()
  avatar: string;
  @IsString()
  @IsNotEmpty()
  avatarHash: string;

}