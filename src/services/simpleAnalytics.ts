import { z } from 'zod';

import { prisma } from '@/lib/prisma';

interface PriceDetails {
  starterUpTo: number;
  startPrice: number;
  businessUpTo: number;
  businessPrice: number;
}

const FIELDS = ['dataPoints', 'developers', 'websites']
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
      service: {
        name: 'simpleAnalytics'
      },
    },
  });

  const total = fieldOptions.reduce((acc, field) => {
    // @ts-ignore
    const { starterUpTo, startPrice, businessPrice } = field.priceDetails as PriceDetails;

    const value = fieldsObject[field.name]
    if (starterUpTo >= value && startPrice > acc) {
      return startPrice
    }

    return businessPrice
  }, 0);

  return total
}
