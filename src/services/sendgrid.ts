import { totalmem } from 'os';
import { Schema, z } from 'zod';

export const schema = z.object({
  name: z.enum(['sendGrid']),
  fields: z.array(
    z.object({
      name: z.string().nonempty(),
      value: z.number()
    })
  )
})

export function calculate(fields: z.infer<typeof schema>['fields']) {
  // TODO fetch prices from database
  const success = schema.safeParse(fields)
  if (!success.success) {
    throw new Error('Invalid fields');
  }

  return {
    total: fields.reduce((acc, field) => acc + field.value, 0),
  }
}