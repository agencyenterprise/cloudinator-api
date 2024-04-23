import { z } from 'zod';

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
export const schema = z.array(
  z.object({
    name: z.enum(['type', 'numberOfDevelopers']),
    value: z.enum(['hobby', 'pro']).or(z.number()).or(z.string()),
  })
);

// TODO: move this to a database
const prices: Record<string, number> = {
  'hobby': 0,
  'pro': 20,
}

export function calculate(fields: z.infer<typeof schema>): number | InvalidError {
  console.log(fields);
  const success = schema.safeParse(fields)
  if (!success.success) {
    return {
      error: 'Invalid fields'
    };
  }

  // TODO fetch prices from database
  const { type, numberOfDevelopers } = fields.reduce((acc, { name, value }) => {
    acc[name] = value
    return acc
  }, {} as Record<string, string | number>)

  if (type === 'pro' && !numberOfDevelopers) {
    return {
      error: 'numberOfDevelopers is required for pro plan'
    }
  }

  return prices[type as string] * Number(numberOfDevelopers || 1)
}
