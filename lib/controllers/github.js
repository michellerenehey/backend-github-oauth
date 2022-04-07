const { Router } = require('express');
const jwt = require('jsonwebtoken');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const GithubUser = require('../models/GithubUser');

module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
    );
  })

  .get('/login/callback', async (req, res, next) => {
    try {
      // get code
      const { code } = req.query;
      // exchange code for token
      const token = await exchangeCodeForToken(code);
      // use token to get github profile
      const profile = await getGithubProfile(token);
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
      // cookie time
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
        // redirect
        .redirect('/api/v1/posts');
    } catch (error) {
      next(error);
    }
  })

  // signs out user
  .delete('/sessions', (req, res, next) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' })
      .catch((error) => next(error));
  });
