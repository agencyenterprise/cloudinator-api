import { z } from 'zod';

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
export const schema = z.array(
  z.object({
    name: z.enum(['productAnalytics', 'sessionReplay', 'featureFlags', 'surveys']),
    value: z.number().or(z.string().transform(Number))
  })
);

// TODO: move this to a database
const prices: Record<string, any> = {
  productAnalytics: {
    freeTearUpTo: 1_000_000,
    price: 0.000248
  },
  sessionReplay: {
    freeTearUpTo: 5_000,
    price: 0.04
  },
  featureFlags: {
    freeTearUpTo: 1_000_000,
    price: 0.0001
  },
  surveys: {
    freeTearUpTo: 250,
    price: 0.2
  },
}
export function calculate(fields: z.infer<typeof schema>): number | InvalidError {
  const success = schema.safeParse(fields)
  if (!success.success) {
    return {
      error: 'Invalid fields'
    };
  }

  const total = fields.reduce((acc, { name, value }) => {
    const freeTearUpTo = prices[name].freeTearUpTo
    if (freeTearUpTo < value) {
      return acc += (value - freeTearUpTo) * prices[name].price
    }

    return acc
  }, 0)

  return total
}

export const config = {
  name: 'postHog',
  type: 'analytics',
  logo: 'https://img.logoipsum.com/334.svg',
  description: 'PostHog is an open-source product analytics platform',
  fields: [
    {
      title: 'Product Analytics',
      name: 'productAnalytics',
      type: 'number',
      defaultValue: prices.productAnalytics.freeTearUpTo,
      required: false
    },
    {
      title: 'Session Replay',
      name: 'sessionReplay',
      type: 'number',
      defaultValue: prices.sessionReplay.freeTearUpTo,
      required: false
    },
    {
      title: 'Feature Flags',
      name: 'featureFlags',
      type: 'number',
      defaultValue: prices.featureFlags.freeTearUpTo,
      required: false
    },
    {
      title: 'Surveys',
      name: 'surveys',
      type: 'number',
      defaultValue: prices.surveys.freeTearUpTo,
      required: false
    }
  ]
}