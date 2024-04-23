import { z } from 'zod';

/**
 * Example of fields:
 * fields: [
 *   {
 *     name: 'Model',
 *     value: 'gpt-4-turbo-2024-04-09'
 *   },
 *   {
 *     name: 'Tokens',
 *     value: 1000000
 *   }
 * ]
 */
export const schema = z.array(
  z.object({
    name: z.enum(['model', 'tokens']),
    value: z.string().or(z.number())
  }).superRefine((data, ctx) => {
      console.log(data)
      if (data.name === 'model') {
        return typeof data.value === 'string' && !!data.value;
      } else {
        return typeof data.value === 'undefined' || typeof data.value === 'number';
      }
    }),
);

// TODO: move this to a database
// Prices for 1kk tokens
const prices: Record<string, number> = {
  'gpt-3.5-turbo-0125': 1.50,
  'gpt-3.5-turbo-instruct': 2.00,
  'gpt-4-turbo-2024-04-09': 30.00,
  'gpt-4': 60.00,
  'gpt-4-32k': 120.00,
}
const DEFAULT_TOKENS = 1000000
export function calculate(fields: z.infer<typeof schema>): number | InvalidError {
  const success = schema.safeParse(fields)
  if (!success.success) {
    return {
      error: 'Invalid fields'
    };
  }

  // TODO fetch prices from database
  const { model, tokens } = fields.reduce((acc, { name, value }) => {
    acc[name] = value
    return acc
  }, {} as Record<string, string | number>)

  return prices[model as string] * (tokens as number) / DEFAULT_TOKENS
}
