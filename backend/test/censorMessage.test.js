const supertest = require('supertest');
const {app, server} = require('../index.js');

beforeAll(() => {
  app.locals.resetChat();
})

describe('GET /censorMessage', () => {
  it('should return 400 if no query param "message" is provided', async () => {
    const response = await supertest(app).get('/censorMessage');
    
    // Check that the status code is 400
    expect(response.status).toBe(400);
  });

  it('should return the original and censored message when "message" query param is provided', async () => {
    const originalMessage = 'The english are a great people from england. psg is a great team in paris, and lyon is also competitive.';
    const response = await supertest(app).get(`/censorMessage?message=${encodeURIComponent(originalMessage)}`);
    
    // Check that the status code is 200
    expect(response.status).toBe(200);

    // Check that the response body matches the expected format
    expect(response.body).toEqual({
      originalMessage: originalMessage,
      censoredMessage: 'The *** are a great people from ***. *** is a great team in ***, and *** is also competitive.'
    });
  });

  it('should censor multiple occurrences of "English" in the message', async () => {
    const originalMessage = 'The English and the English are great people';
    const response = await supertest(app).get(`/censorMessage?message=${encodeURIComponent(originalMessage)}`);
    
    // Check that the status code is 200
    expect(response.status).toBe(200);

    // Check that the response body has both occurrences censored
    expect(response.body).toEqual({
      originalMessage: originalMessage,
      censoredMessage: 'The *** and the *** are great people'
    });
  });

  it('should return the same message if none of the censored words are present', async () => {
    const originalMessage = 'The French are a great people';
    const response = await supertest(app).get(`/censorMessage?message=${encodeURIComponent(originalMessage)}`);
    
    // Check that the status code is 200
    expect(response.status).toBe(200);

    // Check that the original message is returned unchanged
    expect(response.body).toEqual({
      originalMessage: originalMessage,
      censoredMessage: originalMessage // No censorship applied
    });
  });

  it('should handle case insensitivity when censoring', async () => {
    const originalMessage = 'The ENGLISH team played against PSG in Paris, while LYON also participated.';
    const response = await supertest(app).get(`/censorMessage?message=${encodeURIComponent(originalMessage)}`);
    
    // Check that the status code is 200
    expect(response.status).toBe(200);

    // Check that all instances are censored correctly
    expect(response.body).toEqual({
      originalMessage: originalMessage,
      censoredMessage: 'The *** team played against *** in ***, while *** also participated.'
    });
  });
});


afterAll(() => server.close());