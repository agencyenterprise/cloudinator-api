import { PrismaClient } from '@prisma/client';

export async function config() {
  const prisma = new PrismaClient();

  const services = await prisma.service.findMany({
    select: {
      title: true,
      name: true,
      type: true,
      logo: true,
      description: true,
      fields: {
        select: {
          title: true,
          name: true,
          type: true,
          defaultValue: true,
          required: true,
          options: {
            select: {
              value: true,
              label: true,
            },
          },
        },
      },
    }
  });

  await prisma.$disconnect();

  return services;
}