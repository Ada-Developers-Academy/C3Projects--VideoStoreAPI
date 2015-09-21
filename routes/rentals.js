var express = require('express');
var router = express.Router();
var rental_exports = require('../controllers/rentals');

router.get('/', function(req, res, next) {
  return rental_exports.rentalsController.all(req, res);
});

router.get('/:movie_title/rental_info', function(req, res, next) {
  return rental_exports.rentalsController.rental_info(req, res);
});

module.exports = router;
