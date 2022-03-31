const { Router } = require('express');
const fetch = require('cross-fetch');
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
      const resp = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code,
        }),
      });
      const { access_token } = await resp.json();

      const profileResp = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
      console.log('profileResp', profileResp);
      const { avatar_url, login, email } = await profileResp.json();
    } catch (error) {
      next(error);
    }
  });
