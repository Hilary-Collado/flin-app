import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersCrudModule } from './users-crud/users-crud.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersCrudModule, AuthModule, ClientsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
