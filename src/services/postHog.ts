import { z } from 'zod';

import { prisma } from '@/lib/prisma';

interface PriceDetails {
  freeTearUpTo: number;
  price: number;
}

/**
 * Example of fields:
 * fields: [
 *   {
 *     name: 'productAnalytics',
 *     value: 1000000
 *   },
 *   {
 *     name: 'sessionReplay',
 *     value: 5000
 *   },
 *   {
 *     name: 'featureFlags',
 *     value: 1000000
 *   },
 *   {
 *     name: 'surveys',
 *     value: 250
 *   },
 * ]
 */
const FIELDS = ['productAnalytics', 'sessionReplay', 'featureFlags', 'surveys']
export const schema = z.array(
  z.object({
    name: z.enum(FIELDS as [string, ...string[]]),
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
      name: { in: FIELDS },
    },
  });

  const total = fieldOptions.reduce((acc, field) => {
    // @ts-ignore
    const { freeTearUpTo, price } = field.priceDetails as PriceDetails;

    const value = fieldsObject[field.name]
    if (freeTearUpTo < value) {
      return acc += (value - freeTearUpTo) * price
    }

    return acc
  }, 0);

  return total
}
