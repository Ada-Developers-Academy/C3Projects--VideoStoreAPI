var express = require('express');
var router = express.Router();

var Rental = require('../models/rental'),
    rental = new Rental();

var RENTAL_PERIOD = 5; // 5 days

router.post('/checkout/:customer_id/:movie_id', function(req, res, next) {
  // add check for if there is an available movie for checkout
  // query db to count # of rentals with that movie id
  // check movie record to get inventory
  // compare # of rentals with inventory
  // if inventory <= rentals, return message NO
  // else proceed with checkout
  
  var values = [];
  values.push(req.params.customer_id);
  values.push(req.params.movie_id);

  var checkout_date = new Date();
  var return_date = new Date();
  return_date.setDate(return_date.getDate() + RENTAL_PERIOD);

  var defaults = [checkout_date, return_date, "false"];

  values = values + defaults;
  var columns = ['customer_id', 'movie_id', 'checkout_date', 'return_date', 'returned'];

  rental.create(columns, values, function(err, res) {
    res.status(200).json(res);
  });
});

module.exports = router;
