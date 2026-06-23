import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { app } from '../app';

describe('Orders routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /orders retorna a lista de pedidos vazia ou preenchida', async () => {
    const response = await request(app.server).get('/orders');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('orders');
    expect(Array.isArray(response.body.orders)).toBe(true);
  });

  it('POST /orders cria um pedido com o total correto', async () => {
    const response = await request(app.server)
      .post('/orders')
      .send({
        customerId: randomUUID(),
        items: [{ product: 'Keyboard', quantity: 2, price: 50 }],
      });

    expect(response.status).toBe(201);
    expect(response.body.order).toHaveProperty('id');
    expect(response.body.order.status).toBe('draft');
    expect(response.body.order.total).toBe(100);
  });

  it('POST /orders sem itens ou com dados inválidos retorna erro de validação (400)', async () => {
    const response = await request(app.server).post('/orders').send({
      customerId: randomUUID(),
      items: [],
    });

    expect(response.status).toBe(400);
  });

  it('GET /orders/:id busca um pedido existente por ID', async () => {
    const createResponse = await request(app.server)
      .post('/orders')
      .send({
        customerId: randomUUID(),
        items: [{ product: 'Headset', quantity: 1, price: 150 }],
      });

    const orderId = createResponse.body.order.id;

    const response = await request(app.server).get(`/orders/${orderId}`);

    expect(response.status).toBe(200);
    expect(response.body.order.id).toBe(orderId);
    expect(response.body.order.items[0].product).toBe('Headset');
  });

  it('PATCH /orders/:id/status avança o status corretamente', async () => {
    const createResponse = await request(app.server)
      .post('/orders')
      .send({
        customerId: randomUUID(),
        items: [{ product: 'Mouse', quantity: 1, price: 30 }],
      });

    const orderId = createResponse.body.order.id;

    const response = await request(app.server)
      .patch(`/orders/${orderId}/status`)
      .send({ status: 'confirmed' });

    expect(response.status).toBe(200);
    expect(response.body.order.status).toBe('confirmed');
  });

  it('PATCH /orders/:id/status rejeita pular etapas do fluxo', async () => {
    const createResponse = await request(app.server)
      .post('/orders')
      .send({
        customerId: randomUUID(),
        items: [{ product: 'Monitor', quantity: 1, price: 800 }],
      });

    const orderId = createResponse.body.order.id;

    const response = await request(app.server)
      .patch(`/orders/${orderId}/status`)
      .send({ status: 'shipped' });

    expect(response.status).toBe(409);
    expect(response.body.error).toContain('Invalid transition');
  });

  it('GET /orders/:id com um id inexistente retorna 404', async () => {
    const response = await request(app.server).get(`/orders/${randomUUID()}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Order not found');
  });
});
