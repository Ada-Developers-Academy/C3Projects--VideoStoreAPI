var express = require('express');
var router = express.Router();
var customer_exports = require('../controllers/customers');

router.get('/', function(req, res, next) {
  return customer_exports.customersController.all(req, res);
});

module.exports = router;
