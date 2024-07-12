import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MessagingService implements OnModuleInit {
  constructor(@Inject("RABBITMQ_SERVICE") private readonly client: ClientProxy,
              private readonly configService: ConfigService) {
  }

  async onModuleInit() {
    await this.client.connect();
  }

  sendMessage(pattern: string, data: any) {
    try {
      this.client.send(pattern, data);
      console.log("RabbitMQ event sent");
    } catch (err) {
      console.error("Error sending RabbitMQ event:", err.message);
    }
  }
}
