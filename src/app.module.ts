import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RabbitMQModule } from "./rabbitmq/rabbitmq.module";

@Module(
  {
    imports: [
      // MongooseModule.forRoot('mongodb://localhost:27017/nest'),
      ConfigModule.forRoot({
        isGlobal: true
      }),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          uri: "mongodb://localhost:27017/nest"
        }),
        inject: [ConfigService]
      }), UserModule,
      RabbitMQModule
    ]
  }
)
export class AppModule {
}
