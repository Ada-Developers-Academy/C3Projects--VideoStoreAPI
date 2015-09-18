var express = require('express');
var router = express.Router();

var Customer = require('../models/customer'),
    customer = new Customer();

router.get('/', function(req, res, next) {
  customer.find_all(function(err, rows) {
    res.status(200).json({ customers: rows });
  });
});

router.get('/:id', function(req, res, next) {
  var id = req.params.id;

  customer.find_by('id', id, function(err, row) {
    res.status(200).json({ customer: row} );
  });
});

// DEBUGGER ROUTE

// router.get('/:city', function(req, res, next) {
//   var values = [];
//   values.push(req.params.city);
//   console.log(values);

//   customer.where(['city'], values, function(err, rows) {
//     console.log(values);
//     res.status(200).json({ customers: rows} );
//   });
// });

module.exports = router;
