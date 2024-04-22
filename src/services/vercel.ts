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
    value: z.enum(['hobby','pro']).or(z.number()),
  })
);

// TODO: move this to a database
const prices: Record<string, number> = {
  'hobby': 0,
  'pro': 20,
}



export function calculate(fields: z.infer<typeof schema>): number | InvalidError {
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

export const config = {
  name: 'vercel',
  type: 'Hosting',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg',
  description: 'Vercel is a cloud platform for static sites and Serverless Functions that fits perfectly with your workflow. It enables developers to host Jamstack websites and web services that deploy instantly, scale automatically, and requires no supervision, all with no configuration.',
  fields: [
    {
      title: 'Type',
      name: 'type',
      type: 'enum',
      defaultValue: 'hobby',
      options: [
        { value: 'hobby', label: 'Hobby' },
        { value: 'pro', label: 'Pro' },
      ],
      required: true
    },
    {
      title: 'Number of developers',
      name: 'numberOfDevelopers',
      type: 'number',
      required: false
    }
  ]
}