const supertest = require('supertest');
const app = require('./app');
const request = supertest(app);


test('Jest implementatin', async () => {
    const response = await request.get('/');
    expect(response.text).toBe('Hello World');
});


