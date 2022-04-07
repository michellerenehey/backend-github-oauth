const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router()
  .post('/', authenticate, (req, res, next) => {
    console.log('req.user', req.user);
    Post.insert({
      ...req.body,
      username: req.user.username,
    })
      .then((post) => res.send(post))
      .catch((error) => next(error));
    // or .catch(next)
  })

  .get('/', authenticate, (req, res, next) => {
    Post.findAll()
      .then((posts) => res.send(posts))
      .catch((error) => next(error));
  });
