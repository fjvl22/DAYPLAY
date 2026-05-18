const request = require('supertest');
const app = require('../../server');

describe('PAYMENT INTEGRATION TESTS', () => {

  test('should create charge', async () => {

    const res = await request(app)
      .post('/api/payments/charge')
      .set('Authorization', `Bearer TEST_ADMIN_TOKEN`)
      .send({
        userId: 1,
        amount: 10
      });

    expect(res.statusCode).toBe(200);
  });

  test('stripe webhook success', async () => {

    const res = await request(app)
      .post('/api/payments/webhook')
      .send({
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test',
            metadata: {
              paymentId: 1
            }
          }
        }
      });

    expect(res.statusCode).toBe(200);
  });

  test('stripe webhook failed payment', async () => {

    const res = await request(app)
      .post('/api/payments/webhook')
      .send({
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            metadata: {
              paymentId: 1
            }
          }
        }
      });

    expect(res.statusCode).toBe(200);
  });

});