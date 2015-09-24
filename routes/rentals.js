var express = require('express');
var router = express.Router();
var rental_exports = require('../controllers/rentals');

router.get('/', function(req, res, next) {
  return rental_exports.rentalsController.all_rentals(req, res);
});
//
// router.get('/:movie_title', function(req, res, next) {
//   return rental_exports.rentalsController.rented_by(req, res);
// });
router.get('/:movie_title/current_customers', function(req, res, next) {
  return rental_exports.rentalsController.current_customers(req, res);
});

router.get('/:movie_title/rental_log', function(req, res, next) {
  return rental_exports.rentalsController.rental_log(req, res);
});

router.get('/overdue', function(req, res, next) {
  return rental_exports.rentalsController.overdue(req, res);
});

router.get('/check_out', function(req, res, next) {
  return rental_exports.rentalsController.check_out(req, res);
});

router.post('/check_out', function(req, res, next) {
  return rental_exports.rentalsController.check_out(req, res);
});

router.get('/check_in', function(req, res, next) {
  return rental_exports.rentalsController.check_in(req, res);
});

router.put('/check_in', function(req, res, next) { 
  return rental_exports.rentalsController.check_in(req, res);
});

module.exports = router;
