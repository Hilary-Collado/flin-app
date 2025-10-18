'./task.module.ts'
import { Module } from "@nestjs/common";
import { ClientsController } from "./clients.controller";
import { ClientsService } from "./clients.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    controllers: [ClientsController],
    providers: [ClientsService],
    imports: [PrismaModule],
})
export class ClientsModule{}