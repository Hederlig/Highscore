const request = require('supertest');
const app = require('../../app.js');

describe("/api/games", () => {

    describe('GET /api/games', () => { 
        test('200 status code', async () => {

            const response = await request(app)
            .get("/api/games")
            .send();

        expect(response.statusCode).toBe(200)
      }); 

     });
});