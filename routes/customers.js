var express = require('express');
var router = express.Router();

var customer_exports = require('../controllers/customers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  return customer_exports.customersController.index(req, res);
});

router.get('/one_customer', function(req, res, next) {
  // return one customer based on id
  //return customer_exports.customerController.one_customer(req, res);
});

router.get('/:column', function(req, res, next) {
  // return subsets of customers, might be three different endpoints
  // return res.status(200).json({ id: req.params.id })
  return customer_exports.customersController.subset(req, res, req.params.column);
});

module.exports = router;
