// './prisma.module.ts'

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // opcional, pero ayuda a no reimportar en todos lados
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }