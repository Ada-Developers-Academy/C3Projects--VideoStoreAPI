var express = require('express');
var router = express.Router();

var Customer = require('../models/customer'),
    customer = new Customer();

router.get('/', function(req, res, next) {
  customer.find_all(function(err, rows) {
    res.status(200).json({ customers: rows });
  });
});

module.exports = router;
