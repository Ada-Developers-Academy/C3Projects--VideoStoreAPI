var express = require('express');
var router = express.Router();
var moviesController = require('../controllers/movies');

// "GET ./movies/"
router.get("/", function(req, res, next) {
  moviesController.all_movies(req, function(err, result) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(result);
    }
  })
})

// "GET ./movies/{:title}"
router.get("/:title", function(req, res, next) {
  moviesController.movie(req, function(err, result) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(result);
    }
  })
})

module.exports = router;
