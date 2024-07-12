import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UserRepository } from "./repository/user.repository";
import { AvatarRepository } from "./repository/avatar.repository";
import { AvatarSchema } from "./schemas/avatar.schema";
import { RabbitMQModule } from "../rabbitmq/rabbitmq.module";
import { MessagingService } from "../rabbitmq/messaging.service";

@Module({
  imports: [RabbitMQModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
    { name: 'Avatar', schema: AvatarSchema }]),
  ],
  providers: [UserService,UserRepository,AvatarRepository,MessagingService],
  controllers: [UserController]
})
export class UserModule {}
