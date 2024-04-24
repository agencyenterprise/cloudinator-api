import { z } from 'zod';

import { prisma } from '@/lib/prisma';

export const schema = z.array(
  z.object({
    name: z.literal('numberOfEmails'),
    value: z.string().transform(Number).or(z.number())
  })
);

// TODO: move this to a database
const prices = {
  3000: 0,
  50000: 19.95,
  100000: 34.95,
  300000: 89.95,
  700000: 249.00,
  1000000: 499.00,
  2000000: 799.00,
  2500000: 1099.00,
}

export async function calculate(fields: z.infer<typeof schema>): Promise<number | InvalidError> {
  const success = schema.safeParse(fields)
  if (!success.success) {
    return {
      error: 'Invalid fields'
    };
  }

  const { value } = fields.find(e => e.name === "numberOfEmails") || {};
  const fieldOptions = await prisma.field.findFirst({
    where: {
      name: "numberOfEmails",
    },
    include: {
      options: {
        where: {
          value: String(value),
        },
      },
    }
  });

  return fieldOptions?.options[0].price ?? 0
}
