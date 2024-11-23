const supertest = require('supertest');
const {app, server} = require('../index.js');

beforeAll(() => {
  app.locals.resetChat();
})

describe('GET /chat', () => {
  it('Should reply a 200, and the expected JSON content with messages sent previously', async () => {
    let res = await supertest(app)
      .post('/message')
      .send({author: 'Bob', message: 'content'})
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);

    res = await supertest(app).get('/chat');
    expect(res.status).toBe(200);

    // Check that the response body is {"version": "0.2"}
    expect(res.body).toEqual([
      {author: 'admin', message: 'Welcome to the chat!'}, 
      {author: 'Bob', message: 'content'}
    ]);
  });
})

describe('DELETE /chat', () => {
  it('Should reply a 200, and return the initial JSON content of the chat', async () => {
    let res = await supertest(app)
      .post('/message')
      .send({author: 'Bob', message: 'content'})
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(200);

    expect(res.statusCode).toBe(200);

    res = await supertest(app).delete('/chat');

    expect(res.body).toEqual([
      {author: 'admin', message: 'Welcome to the chat!'}
    ]);
  });
})

afterAll(() => server.close());