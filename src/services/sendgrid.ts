import { z } from 'zod';

export const schema = z.array(
  z.object({
    name: z.string().nonempty(),
    value: z.any()
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

export function calculate(fields: z.infer<typeof schema>): number {
  const success = schema.safeParse(fields)
  if (!success.success) {
    throw new Error('Invalid fields');
  }

  // TODO fetch prices from database
  const price = Object.entries(prices).find(([limit]) => fields[0].value < parseInt(limit))?.[1] || 0

  return price
}

export const config = {
  name: 'sendGrid',
  type: 'email',
  logo: 'https://img.logoipsum.com/331.svg',
  description: 'SendGrid is a customer communication platform for transactional and marketing email.',
  fields: [
    {
      title: 'Number of emails per month',
      name: 'numberOfEmails',
      type: 'enum',
      options: [
        { value: 3000, label: '0 - 3000' },
        { value: 50000, label: '3001 - 50,000' },
        { value: 100000, label: '50,001 - 100,000' },
        { value: 300000, label: '100,001 - 300,000' },
        { value: 700000, label: '300,001 - 700,000' },
        { value: 1000000, label: '700,001 - 1,000,000' },
        { value: 2000000, label: '1,000,001 - 2,000,000' },
        { value: 2500000, label: '2,000,001 - 2,500,000' },
      ],
      required: true
    }
  ]
}