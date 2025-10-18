// '../clients/clients.service.ts'
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) { }

  // async list(orgId: number, q: QueryClientDto) {

  //   const where: any = { OrganizationId: orgId };
  //   if (q.status) where.Status = q.status;
  //   if (q.serviceId) where.ServiceId = Number(q.serviceId);
  //   if (q.search) {
  //     where.OR = [
  //       { Name: { contains: q.search, mode: 'insensitive' } },
  //       { Phone: { contains: q.search, mode: 'insensitive' } },
  //       { Notes: { contains: q.search, mode: 'insensitive' } },
  //     ];
  //   }

  //   const [items, total] = await this.prisma.$transaction([
  //     this.prisma.client.findMany({
  //       where,
  //       orderBy: { [q.orderBy!]: q.orderDir },
  //       skip: q.skip,
  //       take: q.take,
  //       include: { Service: true },
  //     }),
  //     this.prisma.client.count({ where }),
  //   ]);

  //   return { items, total, skip: q.skip ?? 0, take: q.take ?? 20 };
  // }


  async list(orgId: number, q: QueryClientDto) {
    const take = Number.isFinite(Number(q.take)) ? Number(q.take) : 20;
    const skip = Number.isFinite(Number(q.skip)) ? Number(q.skip) : 0;
    const orderByField = (q.orderBy === 'Name' || q.orderBy === 'CreatedAt') ? q.orderBy : 'CreatedAt';
    const orderDir = (q.orderDir === 'asc' || q.orderDir === 'desc') ? q.orderDir : 'desc';

    const where: any = { OrganizationId: orgId };
    if (typeof orgId === 'number') where.OrganizationId = orgId;
    if (q.status) where.Status = q.status;
    if (q.serviceId) where.ServiceId = Number(q.serviceId);
    if (q.search) {
      where.OR = [
        { Name: { contains: q.search, mode: 'insensitive' } },
        { Phone: { contains: q.search, mode: 'insensitive' } },
        { Notes: { contains: q.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        where,
        orderBy: { [q.orderBy!]: q.orderDir },
        skip,
        take,
        include: { Service: true },
      }),
      this.prisma.client.count({ where }),
    ]);

    return { items, total, skip, take };
  }

  async getById(orgId: number, id: number) {
    const item = await this.prisma.client.findFirst({
      where: { ClientId: id, OrganizationId: orgId },
      include: { Service: true },
    });
    if (!item) throw new NotFoundException('Client not found');
    return item;
  }

  async create(orgId: number, userId: number, dto: CreateClientDto) {
    return this.prisma.client.create({
      data: {
        Name: dto.name,
        Phone: dto.phone,
        Notes: dto.notes ?? null,
        AvatarUrl: dto.avatarUrl ?? null,
        Status: 'PENDING',
        OrganizationId: orgId,
        CreatedByUserId: userId,
        ServiceId: dto.serviceId ?? null,
      },
    });
  }

  async update(orgId: number, id: number, dto: UpdateClientDto) {
    const exists = await this.prisma.client.findFirst({ where: { ClientId: id, OrganizationId: orgId } });
    if (!exists) throw new NotFoundException('Client not found');

    return this.prisma.client.update({
      where: { ClientId: id },
      data: {
        Name: dto.name ?? undefined,
        Phone: dto.phone ?? undefined,
        Notes: dto.notes ?? undefined,
        AvatarUrl: dto.avatarUrl ?? undefined,
        Status: dto.status ?? undefined,
        ServiceId: dto.serviceId ?? undefined,
      },
    });
  }

  async remove(orgId: number, id: number) {
    const exists = await this.prisma.client.findFirst({ where: { ClientId: id, OrganizationId: orgId } });
    if (!exists) throw new NotFoundException('Client not found');
    await this.prisma.client.delete({ where: { ClientId: id } });
    return { deleted: true };
  }

  listServices(orgId: number) {
    return this.prisma.service.findMany({
      where: { OrganizationId: orgId },
      orderBy: { Name: 'asc' },
    });
  }
}
