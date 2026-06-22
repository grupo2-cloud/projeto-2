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

  it('GET /health returns status ok', async () => {
    const response = await request(app.server).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('GET / returns API information', async () => {
    const response = await request(app.server).get('/');

    expect(response.status).toBe(200);
    expect(response.body.message).toBeDefined();
    expect(response.body.version).toBeDefined();
  });

  it('POST /orders creates an order with the correct total', async () => {
    const response = await request(app.server)
      .post('/orders')
      .send({
        customer: 'Daniel',
        items: [{ product: 'Keyboard', quantity: 2, price: 50 }],
      });

    expect(response.status).toBe(201);
    expect(response.body.order.status).toBe('draft');
    expect(response.body.order.total).toBe(100);
  });

  it('POST /orders without items returns 400', async () => {
    const response = await request(app.server)
      .post('/orders')
      .send({ customer: 'Daniel', items: [] });

    expect(response.status).toBe(400);
  });

  it('PATCH /orders/:id/status advances the status correctly', async () => {
    const createResponse = await request(app.server)
      .post('/orders')
      .send({
        customer: 'Ana',
        items: [{ product: 'Mouse', quantity: 1, price: 30 }],
      });

    const orderId = createResponse.body.order.id;

    const response = await request(app.server)
      .patch(`/orders/${orderId}/status`)
      .send({ status: 'confirmed' });

    expect(response.status).toBe(200);
    expect(response.body.order.status).toBe('confirmed');
  });

  it('PATCH /orders/:id/status rejects skipping steps', async () => {
    const createResponse = await request(app.server)
      .post('/orders')
      .send({
        customer: 'Carlos',
        items: [{ product: 'Monitor', quantity: 1, price: 800 }],
      });

    const orderId = createResponse.body.order.id;

    const response = await request(app.server)
      .patch(`/orders/${orderId}/status`)
      .send({ status: 'shipped' });

    expect(response.status).toBe(409);
  });

  it('GET /orders/:id with a nonexistent id returns 404', async () => {
    const response = await request(app.server).get(`/orders/${randomUUID()}`);

    expect(response.status).toBe(404);
  });
});
