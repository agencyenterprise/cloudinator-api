import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import serviceCalculators from "../../services";
const enuns = Object.keys(serviceCalculators);

const configSchema = z.object({
  services: z.array(
    z.object({
      name: z.enum(enuns as [string, ...string[]]),
      fields: z.array(z.any()),
    }),
  ),
  growthFactor: z.number().optional(),
});

interface ServiceCost {
  services: any[];
  totalCost: 0;
  totalGrowthCost: 0;
}

export async function calculator(
  request: FastifyRequest,
  response: FastifyReply
) {
  const body = configSchema.safeParse(request.body);

  if (body.success === false) {
    return response
      .status(400)
      .send({ message: "Validation error", issues: body.error.format() });
  }

  const result: ServiceCost = {
    services: [],
    totalCost: 0,
    totalGrowthCost: 0,
  };
  const { services, growthFactor } = body.data;
  for (const service of services) {
    const calculator = serviceCalculators[service.name];
    const serviceCost = await calculator.calculate(service.fields);
    let growthCost = 0;
    if (growthFactor && growthFactor !== 1) {
      growthCost = await calculator.calculate(service.fields.map((field) => {
        const value = Number(field.value) ? Math.ceil(field.value * growthFactor) : field.value;
        return {
          ...field,
          value
        }
      }));
    }

    result.services.push({
      name: service.name,
      cost: serviceCost,
      growthCost,
    });
    result.totalCost += serviceCost;
    result.totalGrowthCost += growthCost;
  }

  return result;
}
