const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github');

describe('gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('logging in should redirect to the github oauth page', async () => {
    const req = await request(app).get('/api/v1/github/login');

    expect(req.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/login\/callback/i
    );
  });

  it('logging in should redirect users to /api/v1/posts (GET)', async () => {
    const agent = request.agent(app);
    const res = await agent
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

    expect(res.req.path).toEqual('/api/v1/posts');
  });

  it('signing out should show success message (DELETE)', async () => {
    const agent = request.agent(app);
    const res = await agent.delete('/api/v1/github/sessions');

    expect(res.body).toEqual({
      success: true,
      message: 'Signed out successfully!',
    });
  });
});
