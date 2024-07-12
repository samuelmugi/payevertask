import { Controller, Post, Get, Param, Delete, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from "./dto/user.dto";

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async createUser(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @Get('user/:userId')
  async getUser(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }

  @Get('user/:userId/avatar')
  async getUserAvatar(@Param('userId') userId: string) {
    return this.userService.getUserAvatar(userId);
  }

  @Delete('user/:userId/avatar')
  async deleteUserAvatar(@Param('userId') userId: string) {
    return this.userService.deleteUserAvatar(userId);
  }
}
