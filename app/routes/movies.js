var express = require('express');
var router = express.Router();

/* GET /movies */
router.get('/', function(req, res, next) {
  return movies_exports.moviesController.movies(req, res);
});

module.exports = router;
