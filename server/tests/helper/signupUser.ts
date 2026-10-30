import request from 'supertest';
import app from '../../src/app';

export async function signupUser() {
  const response = await request(app)
    .post('/prasad/signup')
    .send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!'
    });

  expect(response.status).toBe(201);

  return response;
}