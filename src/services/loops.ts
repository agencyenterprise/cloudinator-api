import { z } from 'zod';

import { prisma } from '@/lib/prisma';

export const schema = z.array(
  z.object({
    name: z.literal('numberOfContacts'),
    value: z.string().transform(Number).or(z.number())
  })
);

export async function calculate(fields: z.infer<typeof schema>): Promise<number | InvalidError> {
  const success = schema.safeParse(fields)
  if (!success.success) {
    return {
      error: 'Invalid fields'
    };
  }

  const { value } = fields.find(e => e.name === 'numberOfContacts') || {};
  const fieldOptions = await prisma.field.findFirst({
    where: {
      name: 'numberOfContacts',
      service: {
        name: 'loops'
      },
    },
    include: {
      options: true,
    }
  });

  let price = 0;
  for (let option of fieldOptions?.options ?? []) {
    if (Number(option.value) <= Number(value)) {
      price = option.price;
    }
  }

  return price;
}
