const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');

const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const GithubUser = require('../models/GithubUser');

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
    );
  })

  .get('/login/callback', async (req, res, next) => {
    try {
      // get code
      const { code } = await req.query;
      // exchange code for token
      const token = await exchangeCodeForToken(code);
      console.log('token', token);
      // use token to get github profile
      const profile = await getGithubProfile(token);
      console.log('profile', profile);
      // find github profile in database, if user exists
      let user = await GithubUser.findByUsername(profile.login);
      // if user doesn't exist in database, create
      if (!user) {
        user = await GithubUser.insert({
          username: profile.login,
          email: profile.email,
          avatar: profile.avatar_url,
        });
      }
      console.log('user', user);
      res
        .cookie(
          process.env.COOKIE_NAME,
          jwt.sign({ ...user }, process.env.JWT_SECRET, {
            expiresIn: '1 day',
          }),
          {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
          }
        )
        .redirect('/api/v1/github/posts/');
    } catch (error) {
      next(error);
    }
  })
  .get('/posts', authenticate, async (req, res) => {
    res.json(req.user);
  });
