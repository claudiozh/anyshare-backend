import { Injectable } from '@nestjs/common';
import { Content } from '@prisma/client';
import { PrismaService } from '@src/services/prisma.service';

interface ICreateOrUpdateContent {
  path: string;
  content: string;
}

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  private parsePathWithoutSpaces(path: string): string {
    return String(path).replace(/\s/g, '');
  }

  async findContentByPath(path: string) {
    return this.prisma.content.findUnique({
      where: {
        path,
      },
    });
  }

  async createOrUpdateContent({
    path,
    content,
  }: ICreateOrUpdateContent): Promise<Content> {
    const pathWithoutSpaces = this.parsePathWithoutSpaces(path);

    return this.prisma.content.upsert({
      where: {
        path: pathWithoutSpaces,
      },
      create: {
        content,
        path: pathWithoutSpaces,
      },
      update: {
        content,
      },
    });
  }
}
