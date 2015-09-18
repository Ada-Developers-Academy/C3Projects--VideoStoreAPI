var express = require('express');
var router = express.Router();
var movies_exports = require('../controllers/movies');

/* GET /movies */
router.get('/', function(req, res, next) {
  return movies_exports.moviesController.index(req, res);
});

router.get('/:column/:n/:p', function(req, res, next) {
  return movies_exports.moviesController.by_column(req, res);
});

module.exports = router;
