import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { orders, STATUS_FLOW, calculateTotal } from '../store/order';

export async function ordersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return { orders: Array.from(orders.values()) };
  });

  app.get('/:id', async (request, response) => {
    const getOrderParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getOrderParamsSchema.parse(request.params);

    const order = orders.get(id);

    if (!order) {
      return response.status(404).send({ error: 'Order not found' });
    }

    return { order };
  });

  app.post('/', async (request, response) => {
    const createOrderBodySchema = z.object({
      customerId: z.string().uuid(),
      items: z
        .array(
          z.object({
            product: z.string(),
            quantity: z.number().positive(),
            price: z.number().positive(),
          })
        )
        .nonempty(),
    });

    const { customerId, items } = createOrderBodySchema.parse(request.body);

    const now = new Date().toISOString();

    const order = {
      id: randomUUID(),
      customerId,
      items,
      total: calculateTotal(items),
      status: 'draft' as const,
      createdAt: now,
      updatedAt: now,
    };

    orders.set(order.id, order);

    return response.status(201).send({ order });
  });

  app.patch('/:id/status', async (request, response) => {
    const updateStatusParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const updateStatusBodySchema = z.object({
      status: z.enum(['draft', 'confirmed', 'picking', 'shipped', 'delivered']),
    });

    const { id } = updateStatusParamsSchema.parse(request.params);
    const { status } = updateStatusBodySchema.parse(request.body);

    const order = orders.get(id);

    if (!order) {
      return response.status(404).send({ error: 'Order not found' });
    }

    const currentIndex = STATUS_FLOW.indexOf(order.status);
    const newIndex = STATUS_FLOW.indexOf(status);
    const expectedNext = STATUS_FLOW[currentIndex + 1];

    if (newIndex !== currentIndex + 1) {
      return response.status(409).send({
        error: `Invalid transition. Order is in "${order.status}", can only advance to "${
          expectedNext ?? 'none (already final status)'
        }"`,
      });
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    return { order };
  });
}
