"use strict";

var Customer = require('../models/customers');
var Rentals = require('../models/rentals');

// // ALTERNATIVE WAY OF CODING THIS:
// function CustomersController() {
//   // CODE HERE
// }
// module.exports = CustomersController;

exports.customersController = {
  // GET /customers
  index: function(req, res) {
    // var results = { "customers": [] }
    var db = new Customer();
    var data = db.all(function(err, result) {
      return res.status(200).json(result);
    });
  },
  // GET /customers/:id
  show: function(req, res) {
    // (currently checkout_out movies, rental history)
    var id = req["params"]["id"];
    var db = new Customer();
    var data = db.find_by("id", id, function(err, result) {
      // console.log(result);
      // var db_rentals = new Rentals();
      // var dataing = db_rentals.find_by("")
      // need to receive checked_out movies by customer id
      // need to recieve rental history by customer id

      return res.status(200).json(result);
    });
  }

  // for each customer, add that customer to results
  // for (var i = 0; i < data.length; i++) {
  //   results.customers[i] = {
  //     "id": "yo",
  //     "name": "yo",
  //   }
  // }
};

  /*

  GET /customers/by_name?n=XXX&p=XXX

  GET /customers/by_registered_at?n=XXX&p=XXX

  GET /customers/by_postal_code?n=XXX&p=XXX

  */
