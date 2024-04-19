import { FastifyInstance } from 'fastify'

export async function appRoutes(app: FastifyInstance) {
  // app.post('/users', register)
  /* Authenticated routes */
  app.get('/', function (request, response) {
    response.send({ hello: 'world' })
  });
}
