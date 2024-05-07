import { z } from 'zod';

import { prisma } from '@/lib/prisma';

interface PriceDetails {
  freeTearUpTo: number;
  priceExtraViewsFreeTear: number;
  proPlanPrice: number;
  proTearUpTo: number;
  priceExtraViewsProTear: number;
}

const FIELD = 'monthViews';
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
        name: 'mux'
      },
    },
  });

  const total = fieldOptions.reduce((acc, field) => {
    const { freeTearUpTo, priceExtraViewsFreeTear, proPlanPrice, priceExtraViewsProTear, proTearUpTo } = field.priceDetails as unknown as PriceDetails;

    const value = fieldsObject[field.name];
    if (value < freeTearUpTo) {
      return acc;
    } else if (value < proTearUpTo) {
      const diff = Math.ceil((value - freeTearUpTo) / 1000);
      const cost = diff * priceExtraViewsFreeTear;
      acc += cost > proPlanPrice ? proPlanPrice : cost;
    } else {
      acc += (value - Number(proTearUpTo)) * priceExtraViewsProTear + proPlanPrice;
    }

    return acc;
  }, 0);

  return total;
}
