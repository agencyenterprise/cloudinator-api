import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod'

import serviceCalculators from '../../services';
const enuns = Object.keys(serviceCalculators);

const configSchema = z.array(z.object({
  name: z.enum(enuns as [string, ...string[]]),
  fields: z.array(z.any())
}))

interface ServiceCost {
  services: Record<string, any>;
  totalCost: 0;
}

export function calculator(request: FastifyRequest, response: FastifyReply) {
  const body = configSchema.safeParse(request.body)

  if (body.success === false) {
    return response.status(400).send({ message: 'Validation error', issues: body.error.format() })
  }

  const result: ServiceCost = {
    services: {},
    totalCost: 0
  }

  for (const service of body.data) {
    const calculator = serviceCalculators[service.name];
    const serviceCost = calculator.calculate(service.fields)
    result.services[service.name] = serviceCost;
    result.totalCost += serviceCost;
  }

  return result;
}
