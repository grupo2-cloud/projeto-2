import { FastifyInstance } from 'fastify';
import { env } from '../env';

export async function generalRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return {
      message: 'API Gerenciamento de pedidos',
      version: process.env.npm_package_version ?? '1.0.0',
      environment: env.APP_ENV,
    };
  });

  app.get('/health', async (_, response) => {
    return response.status(200).send({
      status: 'ok',
      version: process.env.npm_package_version,
      environment: env.APP_ENV,
    });
  });
}
