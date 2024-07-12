import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class MessagingService implements OnModuleInit {
  constructor(@Inject("RABBITMQ_SERVICE") private readonly client: ClientProxy) {
  }

  async onModuleInit() {
    await this.client.connect();
  }

   sendMessage(pattern: string, data: any) {
    try {

       this.client.send(pattern, data);
    } catch (err) {
      console.error("Error sending RabbitMQ event:", err.message);
      // Handle the error appropriately
    }
  }
}
