const supertest = require('supertest');
const {app, server} = require('../index.js');

beforeAll(() => {
  app.locals.resetChat();
})

describe('POST /message', () => {
  it('Should reply a 400 error if author is missing', async () => {
    let res = await supertest(app)
      .post('/message')
      .send({message: 'content'})
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toBe(400);
  });

  // Test for a successful POST request
  it('should return 200 when both author and message are provided, and the expected JSON body', async () => {
    const response = await supertest(app)
      .post('/message')
      .send({
        author: 'John Doe',
        message: 'Hello world!'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {author: 'admin', message: 'Welcome to the chat!'}, 
      {author: 'John Doe', message: 'Hello world!'}
    ]);
  });

  // Test for missing "author"
  it('should return 400 when "author" is missing', async () => {
    const response = await supertest(app)
      .post('/message')
      .send({
        message: 'Hello world!'
      });

    expect(response.statusCode).toBe(400);
  });

  // Test for missing "message"
  it('should return 400 when "message" is missing', async () => {
    const response = await supertest(app)
      .post('/message')
      .send({
        author: 'John Doe'
      });

    expect(response.statusCode).toBe(400);
  });

  // Test for both fields missing
  it('should return 400 when both "author" and "message" are missing', async () => {
    const response = await supertest(app)
      .post('/message')
      .send({});

    expect(response.statusCode).toBe(400);
  });

  // Test for empty "author"
  it('should return 400 when "author" is an empty string', async () => {
    const response = await supertest(app)
      .post('/message')
      .send({
        author: '',
        message: 'Hello world!'
      });

    expect(response.statusCode).toBe(400);
  });

  // Test for empty "message"
  it('should return 400 when "message" is an empty string', async () => {
    const response = await supertest(app)
      .post('/message')
      .send({
        author: 'John Doe',
        message: ''
      });

    expect(response.statusCode).toBe(400);
  });
})

afterAll(() => server.close());