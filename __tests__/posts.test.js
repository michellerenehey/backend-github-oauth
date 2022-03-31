const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const GithubUser = require('../lib/models/GithubUser');

jest.mock('../lib/middleware/authenticate.js', () => {
  return (req, res, next) => {
    req.user = {
      username: 'test_user',
      photoUrl: 'http://image.com/image.png',
    };

    next();
  };
});

describe('backend-gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a post when a user is logged in (POST)', async () => {
    // logging in
    const agent = request.agent(app);
    await GithubUser.insert({
      username: 'test_user',
      photoUrl: 'http://image.com/image.png',
    });
    // creating a post
    const expected = { text: 'New post, testing it out!' };
    const res = await agent.post('/api/v1/posts').send(expected);
    expect(res.body).toEqual({
      id: expect.any(String),
      ...expected,
      username: 'test_user',
    });
  });

  it('gets all posts if user is signed in (GET)', async () => {
    const agent = request.agent(app);
    await GithubUser.insert({
      username: 'test_user',
      photoUrl: 'http://image.com/image.png',
    });
    const expected = [
      { text: 'Post 1!' },
      { text: 'Post 2!' },
      { text: 'Post 3!' },
    ];
    const res = await agent.get('/api/v1/posts');
    expect(res.body).toEqual(expected);
  });
});
