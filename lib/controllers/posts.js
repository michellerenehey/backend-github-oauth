const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router()
  .post('/', authenticate, (req, res, next) => {
    Post.insert({
      ...req.body,
      username: req.user.username,
    })
      .then((post) => res.send(post))
      .catch((error) => next(error));
    // or .catch(next)
  })

  .get('/', authenticate, async (req, res, next) => {
    try {
      const posts = await Post.findAll();
      res.send(posts);
    } catch (error) {
      next(error);
    }
  });
