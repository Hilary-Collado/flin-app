// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt'); // si da problema en Windows/Node 22, usa bcryptjs
const prisma = new PrismaClient();

async function main() {
  // 1) Organizaciones
  const auto = await prisma.organization.create({
    data: { Name: 'Flin Auto Sales', Industry: 'AUTO' }
  });
  const beauty = await prisma.organization.create({
    data: { Name: 'Flin Beauty Salon', Industry: 'BEAUTY' }
  });

  // 2) Catálogo de servicios por organización
  const autoServices = await prisma.$transaction([
    prisma.service.create({ data: { OrganizationId: auto.OrganizationId, Code: 'SALE',         Name: 'Venta de vehículo' } }),
    prisma.service.create({ data: { OrganizationId: auto.OrganizationId, Code: 'MAINTENANCE',  Name: 'Mantenimiento' } }),
    prisma.service.create({ data: { OrganizationId: auto.OrganizationId, Code: 'FINANCE',      Name: 'Financiamiento' } }),
    prisma.service.create({ data: { OrganizationId: auto.OrganizationId, Code: 'ACCESSORIES',  Name: 'Accesorios' } }),
  ]);

  const beautyServices = await prisma.$transaction([
    prisma.service.create({ data: { OrganizationId: beauty.OrganizationId, Code: 'HAIR',     Name: 'Cabello' } }),
    prisma.service.create({ data: { OrganizationId: beauty.OrganizationId, Code: 'NAILS',    Name: 'Uñas' } }),
    prisma.service.create({ data: { OrganizationId: beauty.OrganizationId, Code: 'MAKEUP',   Name: 'Maquillaje' } }),
    prisma.service.create({ data: { OrganizationId: beauty.OrganizationId, Code: 'SPA',      Name: 'Spa' } }),
    prisma.service.create({ data: { OrganizationId: beauty.OrganizationId, Code: 'SKINCARE', Name: 'Cuidado de piel' } }),
  ]);

  // 3) Usuarios admin en cada org (pass: 123456)
  const hash = await bcrypt.hash('123456', 10);
  const adminAuto = await prisma.users.create({
    data: { Email: 'pepe@flin.app', PasswordHash: hash, OrganizationId: auto.OrganizationId }
  });
  const adminBeauty = await prisma.users.create({
    data: { Email: 'ana@flin.app', PasswordHash: hash, OrganizationId: beauty.OrganizationId }
  });

  // Atajos para ServiceId
  const sale       = autoServices.find(s => s.Code === 'SALE');
  const maint      = autoServices.find(s => s.Code === 'MAINTENANCE');
  const hair       = beautyServices.find(s => s.Code === 'HAIR');
  const nails      = beautyServices.find(s => s.Code === 'NAILS');

  // 4) Clientes demo por organización
  await prisma.client.createMany({
    data: [
      {
        Name: 'Pedro Martínez', Phone: '809-555-2001', Notes: 'Corolla 2022',
        Status: 'PENDING', OrganizationId: auto.OrganizationId,
        CreatedByUserId: adminAuto.UserId, ServiceId: sale.ServiceId
      },
      {
        Name: 'María López', Phone: '809-555-2002', Notes: 'Cambio aceite',
        Status: 'DONE', OrganizationId: auto.OrganizationId,
        CreatedByUserId: adminAuto.UserId, ServiceId: maint.ServiceId
      },
    ]
  });

  await prisma.client.createMany({
    data: [
      {
        Name: 'Ana Pérez', Phone: '809-555-3001', Notes: 'Coloración',
        Status: 'DONE', OrganizationId: beauty.OrganizationId,
        CreatedByUserId: adminBeauty.UserId, ServiceId: hair.ServiceId
      },
      {
        Name: 'Laura Jiménez', Phone: '809-555-3002', Notes: 'Manicura',
        Status: 'IN_PROGRESS', OrganizationId: beauty.OrganizationId,
        CreatedByUserId: adminBeauty.UserId, ServiceId: nails.ServiceId
      },
    ]
  });

  console.log('Seed OK →');
  console.log('  Auto   : admin.auto@flin.app / 123456');
  console.log('  Beauty : admin.beauty@flin.app / 123456');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});