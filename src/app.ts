import fastify from 'fastify';
import { generalRoutes } from './routes/general';
import { ordersRoutes } from './routes/orders';

export const app = fastify();

app.register(generalRoutes);
app.register(ordersRoutes, { prefix: '/orders' });
