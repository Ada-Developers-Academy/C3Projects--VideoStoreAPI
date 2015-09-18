"use strict";

var Customer = require('../models/customers');

// // ALTERNATIVE WAY OF CODING THIS:
// function CustomersController() {
//   // CODE HERE
// }
// module.exports = CustomersController;

exports.customersController = {
  // GET /customers
  index: function(req, res) {
    var results = { "customers": [] }
    var db = new Customer();
    var data = db.everything(function(err, result) {
      return res.status(200).json(result);
    });

    // find_by

    // for each customer, add that customer to results
    // for (var i = 0; i < data.length; i++) {
    //   results.customers[i] = {
    //     "id": "yo",
    //     "name": "yo",
    //   }
    // }
    var results = { "customers": [] }
    // var db = new Customer();
    // console.log("db = " + db);
    // var data = db.everything();
    // console.log("data = " + data);
    var db = new Customer();
    var data = db.find_by("id", 1, function(err, result) {
      // console.log("res: " + res.as_json);
      // return res;
      return res.status(200).json(result);
    });
  }
  // GET /customers/:id
  // show: function(req, res) {
  // // (currently checkout_out movies, rental history)
  //
  // }

  /*

  GET /customers/by_name?n=XXX&p=XXX

  GET /customers/by_registered_at?n=XXX&p=XXX

  GET /customers/by_postal_code?n=XXX&p=XXX

  */
}
