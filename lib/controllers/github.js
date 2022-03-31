const { Router } = require('express');
const fetch = require('cross-fetch');
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
      const { code } = await req.query;
      const token = await exchangeCodeForToken(code);
      const profile = await getGithubProfile(token);
      console.log('profile', profile);
    } catch (error) {
      next(error);
    }
  });
