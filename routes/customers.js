var express = require('express');
var router = express.Router();
var customersController = require('../controllers/customers');

/* GET customers listing. */

// "/customers "
router.get('/', function(req, res, next) {
  // res = express' response object (how it responds to the GET request)

  customersController.all_customers(req, function(err, result) {
    
    if (err) {
      res.status(500).json(err);
    } else { 
      res.status(200).json(result);
    };

  });

});

// "/customers/{:id}"
router.get('/:id', function(req, res, next) {
  customersController.customer(req, function(err, result) {
    
    if (err) {
      res.status(500).json(err);
    } else { 
      res.status(200).json(result);
    };

  })

});

module.exports = router;
