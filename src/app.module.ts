import { ContentService } from './services/content.service';
import { PrismaService } from '@src/services/prisma.service';
import { Module } from '@nestjs/common';
import { EventsGateway } from '@src/gateway/events.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [EventsGateway, PrismaService, ContentService],
})
export class AppModule {}
