import request from 'supertest';
import app from '../../src/app';

export async function getAuthToken() {
    const email = 'test@example.com';
    const password = 'TestPassword123!';

    // Assumes this test user has already been created.
    const response = await request(app)
        .post('/prasad/login')
        .send({ email, password });

    expect(response.status).toBe(200);

    return response.body.token;
}