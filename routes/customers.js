var express = require('express');
var router = express.Router();
var customer_exports = require('../controllers/customers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  return customer_exports.customersController.index(req, res);
});

router.get('/:id', function(req, res, next) {
  return customer_exports.customersController.show(req, res);
});

module.exports = router;
