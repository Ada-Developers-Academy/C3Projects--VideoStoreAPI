var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// '/customers'
router.get('/', function(req, res, next) {
  return customers_exports.customersController.all_customers(req, res);

});

// '/customers/:sort_by/:results_per_page/:page_number'
// :sort_by = (:name/:registered_at/:postal_code)
router.get('/:sort_by/:results_per_page/:page_number', function(req, res, next) {
  return customers_exports.customersController.sort_pages(req, res);
});

// with a customer's id - the movies they currently have checked out
// '/customers/:id/current'
router.get('/:id/current', function(req, res, next) {
  return customers_exports.customersController.sort_pages(req, res);
});

// with a customer's id - '/customers/:id/...'
// the movies a customer has checked out in the past
//      '/customers/:id/previous'
//              ordered by check out date
//              includes return date

router.get('/:id/previous', function(req, res, next) {
  return customers_exports.customersController.sort_pages(req, res);
});

module.exports = router;