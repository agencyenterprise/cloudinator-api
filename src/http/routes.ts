import { FastifyInstance } from 'fastify';
import { config } from './controller/config';
import { calculator } from './controller/calculator';
import { aiChat } from './controller/aiCalculator';

export async function appRoutes(app: FastifyInstance) {
  app.get('/config', config);
  app.post('/calculator', calculator);
  app.post('/service-suggestion', aiChat);
}
