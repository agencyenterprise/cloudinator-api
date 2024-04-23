import { z } from 'zod';

export const schema = z.array(
  z.object({
    name: z.string().nonempty(),
    value: z.string().transform(Number).or(z.number())
  })
);

// TODO: move this to a database
const prices = {
  3000: 0,
  50000: 19.95,
  100000: 34.95,
  300000: 89.95,
  700000: 249.00,
  1000000: 499.00,
  2000000: 799.00,
  2500000: 1099.00,
}

export function calculate(fields: z.infer<typeof schema>): number | InvalidError {
  const success = schema.safeParse(fields)
  if (!success.success) {
    return {
      error: 'Invalid fields'
    };
  }

  // TODO fetch prices from database
  const price = prices[fields.find(e => e.name === "numberOfEmails").value] || 0;

  return price
}
