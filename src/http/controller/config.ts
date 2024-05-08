import { prisma } from '@/lib/prisma'

export async function config() {
  const services = await prisma.service.findMany({
    select: {
      title: true,
      name: true,
      type: true,
      logo: true,
      description: true,
      link: true,
      fields: {
        select: {
          title: true,
          name: true,
          type: true,
          defaultValue: true,
          required: true,
          maxSelectableValue: true,
          minSelectableValue: true,
          options: {
            select: {
              value: true,
              label: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      },
    }
  });

  return services;
}