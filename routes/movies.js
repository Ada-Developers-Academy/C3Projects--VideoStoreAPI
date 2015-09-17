var express = require('express');
var router = express.Router();
var movies_exports = require('../controllers/movies')

/* GET home page. */
router.get('/', function(req, res, next) {
  return movies_exports.moviesController.index(req, res);
});

module.exports = router;
