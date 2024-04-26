import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { FieldWithOptions } from '@/@types/services';

/**
 * Example of fields:
 * fields: [
 *   {
 *     name: 'model',
 *     value: 'gpt-4-turbo-2024-04-09'
 *   },
 *   {
 *     name: 'tokens',
 *     value: 1000000
 *   }
 * ]
 */
const FIELDS = ['model', 'tokens']
export const schema = z.array(
  z.object({
    name: z.enum(FIELDS as [string, ...string[]]),
    value: z.string().or(z.number())
  }).superRefine((data, ctx) => {
      if (data.name === 'model') {
        return typeof data.value === 'string' && !!data.value;
      } else {
        return typeof data.value === 'undefined' || typeof data.value === 'number';
      }
    }),
);

export async function calculate(fields: z.infer<typeof schema>): Promise<number | InvalidError> {
  const success = schema.safeParse(fields)
  if (!success.success) {
    return {
      error: 'Invalid fields'
    };
  }

  const { model, tokens } = fields.reduce((acc, { name, value }) => {
    acc[name] = value
    return acc
  }, {} as Record<string, string | number>);

  const fieldOptions = await prisma.field.findMany({
    where: {
      name: { in: FIELDS },
      service: {
        name: 'openAi'
      },
    },
    include: {
      options: {
        where: {
          value: String(model),
        },
      },
    }
  });

  const fieldsObject = fieldOptions.reduce((acc, field) => {
    acc[field.name] = field
    return acc
  }, {} as Record<string, FieldWithOptions>);

  const defaultTokens = Number(fieldsObject.tokens.defaultValue) || 1_000_000;
  const price = fieldsObject.model.options[0].price || 0;
  return price * (tokens as number || defaultTokens) / defaultTokens
}
