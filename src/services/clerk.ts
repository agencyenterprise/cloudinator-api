import { z } from 'zod';

import { prisma } from '@/lib/prisma';

interface PriceDetails {
  freeTearUpTo: number;
  proPlanPrice: number;
  pricePerMAU: number;
}

const FIELD = 'mau';
export const schema = z.array(
  z.object({
    name: z.literal(FIELD),
    value: z.number().or(z.string().transform(Number))
  })
);

export async function calculate(fields: z.infer<typeof schema>): Promise<number | InvalidError> {
  const success = schema.safeParse(fields)
  if (!success.success) {
    return {
      error: 'Invalid fields'
    };
  }

  const fieldsObject = fields.reduce((acc, { name, value }) => {
    acc[name] = value
    return acc
  }, {} as Record<string, number>)

  const fieldOptions = await prisma.field.findMany({
    where: {
      name: FIELD,
      service: {
        name: 'clerk'
      },
    },
  });

  const total = fieldOptions.reduce((acc, field) => {
    // @ts-ignore
    const { freeTearUpTo, pricePerMAU, proPlanPrice } = field.priceDetails as PriceDetails;

    const value = fieldsObject[field.name]
    if (value > freeTearUpTo) {
      return (value - Number(field.defaultValue)) * pricePerMAU + proPlanPrice
    }

    return acc
  }, 0);

  return total
}
