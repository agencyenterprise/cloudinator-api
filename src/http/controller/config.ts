import type { FastifyReply, FastifyRequest } from 'fastify';

export function config() {
    return [
      {
        name: 'SendGrid',
        type: 'email',
        logo: 'https://img.logoipsum.com/331.svg',
        description: 'SendGrid is a customer communication platform for transactional and marketing email.',
        fields: [
          {
            title: 'Number of emails per month',
            name: 'numberOfEmails',
            type: 'number',
            required: true
          }
        ]
      }
    ]
  }