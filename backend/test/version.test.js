const supertest = require('supertest');
const {app, server} = require('../index.js');


describe('GET /version', () => {
  it('should return 200 with the correct version in the response body', async () => {
    const response = await supertest(app).get('/version');
    
    // Check that the status code is 200
    expect(response.status).toBe(200);

    // Check that the response body is {"version": "0.2"}
    expect(response.body).toEqual({ version: '0.2' });
  });
});


afterAll(() => server.close());