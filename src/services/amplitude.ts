import { z } from 'zod';

import { prisma } from '@/lib/prisma';

const FIELD_NAME = 'mtu'
export const schema = z.array(
  z.object({
    name: z.literal(FIELD_NAME),
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

  const { value } = fields.find(e => e.name === FIELD_NAME) || {};
  const fieldOptions = await prisma.field.findFirst({
    where: {
      name: FIELD_NAME,
    },
    include: {
      options: true,
    }
  });

  let price = 0;
  for (let option of fieldOptions?.options ?? []) {
    if (Number(option.value) >= Number(value)) {
      price = option.price;
      break;
    }
  }

  return price;
}
