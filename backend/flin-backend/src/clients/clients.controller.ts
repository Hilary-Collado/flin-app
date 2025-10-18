// './clients.controller.ts'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Get()
  list(@Req() req: any, @Query() query: QueryClientDto) {
    return this.service.list(req.user.orgId, query);
  }

  @Get('services')
  listServices(@Req() req: any) {
    return this.service.listServices(req.user.orgId);
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.service.getById(req.user.orgId, Number(id));
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateClientDto) {
    return this.service.create(req.user.orgId, req.user.userId, dto);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.service.update(req.user.orgId, Number(id), dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.orgId, Number(id));
  }
}
