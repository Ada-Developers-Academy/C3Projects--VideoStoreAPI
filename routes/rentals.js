var express = require('express');
var router = express.Router();
var rentals_exports = require("../controllers/rentals");

/* GET home page. */
// for specific movie, show all customers w/ it checkout out
router.get('checkedout/:title', function(req, res, next) {
  return movies_exports.moviesController.checkedout(req, res);
});
// all customers w/ specific movie checked out in past
// default show sorted by check out date??
router.get('/history/:title', function(req, res, next) {
  return movies_exports.moviesController.title_history(req, res);
});
// for movie, sort check out history by customer id
router.get('/history/id/:title', function(req, res, next) {
  return movies_exports.moviesController.id_history(req, res);
});
// for movie, sort check out history by customer name
router.get('/history/name/:title', function(req, res, next) {
  return movies_exports.moviesController.name_history(req, res);
});

router.get('/customers/current/:title', function(req, res, next) {
 return rentals_exports.rentalsController.customers_current(req, res);
});

router.put('/checkout/:title/:customer_id', function(req, res, next) {
 return rentals_exports.rentalsController.checkout(req, res);
});

router.put('/checkin/:title/:customer_id', function(req, res, next) {
 return rentals_exports.rentalsController.checkin(req, res);
});

router.get('/customers/overdue', function(req, res, next) {
 return rentals_exports.rentalsController.overdue(req, res);
});

module.exports = router;
