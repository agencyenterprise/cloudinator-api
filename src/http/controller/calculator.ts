import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod'

import calculators from '../../services';
const enuns = Object.keys(calculators);

const configSchema = z.array(z.object({
  name: z.enum(enuns as [string, ...string[]]),
  fields: z.array(z.any())
}))

export function calculator(request: FastifyRequest, response: FastifyReply) {
  const body = configSchema.safeParse(request.body)

  if (body.success === false) {
    return response.status(400).send({ message: 'Validation error', issues: body.error.format() })
  }

  const result = {
    services: [],
    totalCost: 0
  }

  for (const service of body.data) {
    const calculator = calculators[service.name];
    const serviceCost = calculator.calculate(service.fields)
    result.services.push(serviceCost);
  }

  return result;
}