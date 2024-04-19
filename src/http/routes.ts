import { FastifyInstance } from 'fastify';
import { config } from './controller/config';
import { calculator } from './controller/calculator';


export async function appRoutes(app: FastifyInstance) {
  app.get('/config', config);
  app.post('/calculator', calculator);
}
