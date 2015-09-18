var express = require('express');
var router = express.Router();
var customersController = require('../controllers/customers');

/* GET customers listing. */

// "/customers "
router.get('/', function(req, res, next) {
  // res = express' response object (how it responds to the GET request)
  var return_data = customersController.all_customers(req, function(err, result) {
    res.send(200).json(result);
  })

});

// "/customers/{:id}"
// router.get('/:id', function(req, res, next) {
//   return customersController.customer(req, res);
// });

module.exports = router;
