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

  .get('/login/callback', (req, res, next) => {
    const { code } = req.query;
    let profile;
    exchangeCodeForToken(code)
      .then((token) => getGithubProfile(token))
      .then(({ username, photoUrl, email }) => {
        profile = { username, photoUrl, email };
        return GithubUser.findByUsername(username);
      })
      .then((user) => {
        if (user) {
          return user;
        } else {
          return GithubUser.insert(profile);
        }
      })
      .then((user) => {
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
          .redirect('/api/v1/posts');
      })
      .catch((error) => next(error));
  })

  // signs out user
  .delete('/sessions', (req, res, next) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' })
      .catch((error) => next(error));
  });
