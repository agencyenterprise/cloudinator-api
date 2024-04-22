import { z } from 'zod';

export const schema = z.array(
  z.object({
    name: z.string().nonempty(),
    value: z.any()
  })
);

type CalculateResult = {
  serviceName: string;
  serviceTier: string;
  error?: string | null;
  totalCost?: number;
}

//Used to frontend know what fields are available and their constraints
const fieldInfo = {
  name: 'tier',
  defaultValue: 'free',
  minValue: 0,
  maxValue: 100000,
  type: 'enum',
  valueOptions: ['free', 'essentials', 'pro']
}

export function calculate(fields: z.infer<typeof schema>): CalculateResult {
  // TODO fetch prices from database
  const success = schema.safeParse(fields)
  console.log(fields);
  if (!success.success) {
    throw new Error('Invalid fields');
  }

  const tierField = fields.find(field => field.name === "tier")!;
  const emailsPerMonth = fields.find(field => field.name === "emailsPerMonth")?.value;

  const result: CalculateResult = {
    serviceName: "SendGrid",
    serviceTier: tierField?.value
  }


  switch (tierField.value) {
    case "free":
      if (emailsPerMonth / 30 > 100) {
        result.error = "You can't have more than 100 emails per day with the free tier";
      } else {
        result.totalCost = 0;
      }
      break;
    case "essentials":
      if (emailsPerMonth <= 50000) {
        result.totalCost = 19.95;
      } else {
        result.totalCost = 34.95;
      }

      if (emailsPerMonth > 100000) {
        result.totalCost += (emailsPerMonth - emailsPerMonth) * 0.00088;
      }
      break;
    case "pro":
      if (emailsPerMonth <= 150000) {
        result.totalCost = 89.95;
      } else if (emailsPerMonth <= 500000) {
        result.totalCost = 249;
      } else if (emailsPerMonth <= 1000000) {
        result.totalCost = 499;
      }
      else if (emailsPerMonth <= 1500000) {
        result.totalCost = 799;
      }
      else {
        result.totalCost = 1099;
      }

      if (emailsPerMonth > 2500000) {
        result.totalCost += (emailsPerMonth - 2500000) * 0.00047;
      }
      break;
  }

  // return fields.reduce((acc, field) => acc + field.value, 0)
  return result;
}