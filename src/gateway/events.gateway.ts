import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ContentService } from '@src/services/content.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  private logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  private server: Server;

  constructor(private readonly contentService: ContentService) {}

  @SubscribeMessage('create-room')
  async createRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = data?.room;

      if (!room) {
        throw new Error('Name is required to create new room');
      }

      await client.join(room);

      this.server.in(room).emit('room-created', {
        room,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  @SubscribeMessage('find-content')
  async findContent(
    @MessageBody() data: { room: string },
  ): Promise<{ content: string }> {
    const contentDB = await this.contentService.findContentByPath(data?.room);

    return {
      content: contentDB?.content,
    };
  }

  @SubscribeMessage('save-content')
  async saveContent(
    @MessageBody() data: { room: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const newContent = await this.contentService.createOrUpdateContent({
      content: data?.content,
      path: data?.room,
    });

    client.in(data.room).emit('content', {
      content: newContent.content,
    });
  }
}
