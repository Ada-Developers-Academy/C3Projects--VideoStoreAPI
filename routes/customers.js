var express = require('express');
var router = express.Router();

var customer_exports = require('../controllers/customers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //return list of all customers
  // return customer_exports.customerController.index(req, res);
});

router.get('/one_customer', function(req, res, next) {
  // return one customer based on id
  //return customer_exports.customerController.one_customer(req, res);
});

router.get('/group_customers', function(req, res, next) {
  // return subsets of customers, might be three different endpoints
  // return res.status(200).json({ id: req.params.id })
});

module.exports = router;
