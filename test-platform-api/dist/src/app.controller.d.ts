import { PrismaService } from './prisma.service';
import { Question as QuestionModel } from '@prisma/client';
export declare class AppController {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    getPostById(id: string): Promise<QuestionModel>;
    getPosts(): Promise<QuestionModel[]>;
}
