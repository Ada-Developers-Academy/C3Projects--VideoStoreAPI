var express = require('express');
var router  = express.Router();
var async   = require('async');

var Customer = require('../models/customer'),
    customer = new Customer();

var Rental   = require('../models/rental'),
    rental   = new Rental();

var Movie    = require('../models/movie'),
    movie    = new Movie();

router.get('/', function(req, res, next) {
  customer.find_all(function(err, rows) {
    res.status(200).json({ customers: rows });
  });
});

router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  var current_rentals = [];
  var past_rentals = [];
  var customer_info;

  async.waterfall([
    // get current movie rentals
    function(callback) {
      rental.where(['customer_id', 'returned'], [id, "false"], function(err, rows) {
        for (var i = 0; i < rows.length; i++) {
          movie.find_by('id', rows[i].movie_id, function(err, movie) {
            current_rentals.push(movie);
          });
        }
        callback(null);
      });
    },
    // get past movie rentals
    function(callback) {
      rental.where(['customer_id', 'returned'], [id, "true"], function(err, rows) {
        for (var i = 0; i < rows.length; i++) {
          movie.find_by('id', rows[i].movie_id, function(err, movie) {
            past_rentals.push(movie);
          });
        }
        callback(null);
      });
    },
    // get customer data
    function(callback) {
      customer.find_by('id', id, function(err, row) {
        customer_info = row;
        callback(null);
      });
    },
    // putting the json data all together for customers/:id
  ], function(error, result) {
    res.status(200).json({ customer_data: customer_info, rentals: { current_movies: current_rentals, past_movies: past_rentals } });
  });
});

  // json returned in the following format
  // { customer_data: { 
  //   name: "Joe",
  //   city: "Dallas" 
  //   }, 
  //   rentals: { 
  //      current movie objects: [ { movie object }, { movie object } ],
  //      past movie objects: [ { movie object }, { movie object } ] 
  //   }
  // }

router.get('/:sort_by/:limit/:offset', function(req, res, next) {
  var values = [];
  values.push(req.params.limit);
  values.push(req.params.offset);
  var column = req.params.sort_by;

  customer.subset(column, values, function(err, rows) {
    res.status(200).json({ customers: rows} );
  });
});

router.post('/create/:name/:registered_at/:address/:city/:state/:postal_code/:phone', function(req, res, next) {
  var values = [];
  values.push(req.params.name);
  values.push(req.params.registered_at);
  values.push(req.params.address);
  values.push(req.params.city);
  values.push(req.params.state);
  values.push(req.params.postal_code);
  values.push(req.params.phone);
  var columns = ['name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone']

  customer.create(columns, values, function(err, res) {
    res.status(200).json(res);
  });
});

// DEBUGGER ROUTE

router.get('/where/:city', function(req, res, next) {
  var values = [];
  values.push(req.params.city);
  console.log(values);

  customer.where(['city'], values, function(err, rows) {
    console.log(rows.length);
    res.status(200).json({ customers: rows} );
  });
});

module.exports = router;
