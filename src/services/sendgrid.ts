import { z } from 'zod';

export const schema = z.array(
  z.object({
    name: z.string().nonempty(),
    value: z.number()
  })
);

export function calculate(fields: z.infer<typeof schema>): number {
  // TODO fetch prices from database
  const success = schema.safeParse(fields)
  if (!success.success) {
    throw new Error('Invalid fields');
  }

  return fields.reduce((acc, field) => acc + field.value, 0)
}