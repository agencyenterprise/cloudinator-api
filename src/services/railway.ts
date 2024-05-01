import { z } from "zod";

import { prisma } from "@/lib/prisma";

interface PriceDetails {
  priceOneDev: number;
  pricePerDev: number;
}

/**
 * Example of fields:
 * fields: [
 *   {
 *     name: 'numberOfDevelopers',
 *     value: 5
 *   }
 * ]
 */
const FIELD = 'numberOfDevelopers';
export const schema = z.array(
  z.object({
    name: z.literal(FIELD),
    value: z.number().or(z.string()),
  })
);

export async function calculate(
  fields: z.infer<typeof schema>
): Promise<number | InvalidError> {
  const success = schema.safeParse(fields);
  if (!success.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { numberOfDevelopers } = fields.reduce((acc, { name, value }) => {
    acc[name] = value;
    return acc;
  }, {} as Record<string, string | number>);

  const fieldOptions = await prisma.field.findMany({
    where: {
      name: FIELD,
      service: {
        name: "railway",
      },
    },
  });

  const field = fieldOptions.find(field => field.name === FIELD);
  if (!field) {
    return 0;
  }

  const { priceOneDev, pricePerDev } = field.priceDetails as unknown as PriceDetails;

  if (Number(numberOfDevelopers) === 1) {
    return priceOneDev;
  } else {
    return Number(numberOfDevelopers) * pricePerDev;
  }
}
