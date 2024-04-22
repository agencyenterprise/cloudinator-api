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
export function calculate(fields: z.infer<typeof schema>): number {
  const success = schema.safeParse(fields)
  if (!success.success) {
    throw new Error('Invalid fields');
  }

  // TODO fetch prices from database
  const { model, tokens } = fields.reduce((acc, { name, value }) => {
    acc[name] = value
    return acc
  }, {} as Record<string, string | number>)

  return prices[model as string] * (tokens as number) / DEFAULT_TOKENS
}

export const config = {
  name: 'openAi',
  type: 'Artifial Intelligence',
  logo: 'https://img.logoipsum.com/332.svg',
  description: 'OpenAI is an artificial intelligence research laboratory consisting of the for-profit OpenAI LP and the non-profit OpenAI Inc. The company, considered a competitor to DeepMind, conducts research in the field of artificial intelligence (AI) with the stated aim to promote and develop friendly AI in a way that benefits humanity as a whole. The company is primarily known for its GPT series of language models.',
  fields: [
    {
      title: 'Model',
      name: 'model',
      type: 'enum',
      defaultValue: 'gpt-3.5-turbo-0125',
      options: [
        { value: 'gpt-4-turbo-2024-04-09', label: 'GPT-4 Turbo (2024-04-09)' },
        { value: 'gpt-4', label: 'GPT-4' },
        { value: 'gpt-4-32k', label: 'GPT-4 32k' },
        { value: 'gpt-3.5-turbo-0125', label: 'GPT-3.5 Turbo 0125' },
        { value: 'gpt-3.5-turbo-instruct', label: 'GPT-3.5 Turbo Instruct' },
      ],
      required: true
    },
    {
      title: 'Tokens',
      name: 'tokens',
      type: 'number',
      defaultValue: DEFAULT_TOKENS,
      required: false
    }
  ]
}