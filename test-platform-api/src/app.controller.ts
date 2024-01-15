import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Question as QuestionModel, Prisma } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('question/:id')
  async getPostById(@Param('id') id: string): Promise<QuestionModel> {
    return this.prismaService.question.findUnique({
      where: { id: Number(id) },
    });
  }

  @Get('questions')
  async getPosts(): Promise<QuestionModel[]> {
    return await this.prismaService.question.findMany();
  }
}
