var express = require('express');
var router = express.Router();
var rental_exports = require('../controllers/rentals');

router.get('/', function(req, res, next) {
  return rental_exports.rentalsController.all(req, res);
});
// 
// router.get('/:movie_title', function(req, res, next) {
//   return rental_exports.rentalsController.rented_by(req, res);
// });

router.get('/overdue', function(req, res, next){
  return rental_exports.rentalsController.overdue(req, res);
});

module.exports = router;
