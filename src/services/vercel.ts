import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { FieldWithOptions } from '@/@types/services';

/**
 * Example of fields:
 * fields: [
 *   {
 *     name: 'type',
 *     value: 'pro'
 *   },
 *   {
 *     name: 'numberOfDevelopers',
 *     value: 5
 *   }
 * ]
 */
const FIELDS = ['type', 'numberOfDevelopers']
export const schema = z.array(
  z.object({
    name: z.enum(FIELDS as [string, ...string[]]),
    value: z.enum(['hobby', 'pro']).or(z.number()).or(z.string()),
  })
);

export async function calculate(fields: z.infer<typeof schema>): Promise<number | InvalidError> {
  const success = schema.safeParse(fields)
  if (!success.success) {
    return {
      error: 'Invalid fields'
    };
  }

  const { type, numberOfDevelopers } = fields.reduce((acc, { name, value }) => {
    acc[name] = value
    return acc
  }, {} as Record<string, string | number>)

  if (type === 'pro' && !numberOfDevelopers) {
    return {
      error: 'numberOfDevelopers is required for pro plan'
    }
  }

  const fieldOptions = await prisma.field.findMany({
    where: {
      name: { in: FIELDS },
    },
    include: {
      options: {
        where: {
          value: String(type),
        },
      },
    }
  });

  const fieldsObject = fieldOptions.reduce((acc, field) => {
    acc[field.name] = field
    return acc
  }, {} as Record<string, FieldWithOptions>);

  const price = fieldsObject.type.options[0].price || 0;
  return price * Number(numberOfDevelopers || 1)
}
