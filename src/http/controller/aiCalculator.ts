import { ChatRequest, generateChatRequest } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { FastifyRequest } from 'fastify';

export async function aiChat(request: FastifyRequest) {
  const { messages } = request.body as { messages: ChatRequest[] };

  const services = await prisma.service.findMany({
    select: {
      name: true,
      type: true,
      description: true,
      fields: {
        select: {
          title: true,
          name: true,
          type: true,
          defaultValue: true,
          required: true,
          options: {
            select: {
              value: true,
              label: true,
            },
          },
        }
      },
    },
  });

  return generateChatRequest({ services, messages });
}


