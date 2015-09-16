var express = require('express');
var router = express.Router();
var customer_exports = require('..controllers/customers');

/* GET */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  return customer_exports.customerController.zomg(req, res);
});

module.exports = router;
