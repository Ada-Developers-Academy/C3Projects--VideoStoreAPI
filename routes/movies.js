"use strict";
var express = require('express');
var router = express.Router();
var movies_exports = require('../controllers/movies')

/* GET all movies */
router.get('/', function(req, res, next) {
  return movies_exports.moviesController.findAllMovies(req, res)
});

module.exports = router;
