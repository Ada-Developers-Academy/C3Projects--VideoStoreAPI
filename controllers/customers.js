"use strict";

// function CustomersController() {
//   console.log("HELLO");
// }

exports.customersController = {
  index: function(req, res) {
    var results = { "customers": [] }


    // create our own models

    // for each customer, add that customer to results
    for (var i = 0; i < !!!USERS!!!; i++) {
      results.customers[i] = {
        "id": ,
        "name": ,
      }
    }

    return res.status(200).json(results);
  }


  /*
  GET /customers
  all customers

  GET /customers/:id
  (currently checkout_out movies, rental history)

  GET /customers/by_name?n=XXX&p=XXX

  GET /customers/by_registered_at?n=XXX&p=XXX

  GET /customers/by_postal_code?n=XXX&p=XXX

  */
}
