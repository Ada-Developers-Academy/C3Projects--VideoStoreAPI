"use strict";

var customer_instance = require('../models/customers');
var Customer = new customer_instance;

function sortBy(sort_by, req, res) {
  var number = req["query"]["n"];
  var pages = req["query"]["p"];
  Customer.find_by_sorted(sort_by, number, pages, function(err, result) {
    return res.status(200).json(result);
  });
}

function showRentals(the_function, req, res) {
  var id = req["params"]["id"];
  the_function(id, function(err, result) {
    return res.status(200).json(result);
  });
}

exports.customersController = {
  // GET /customers
  index: function(req, res) {
    Customer.all(function(err, result) {
      return res.status(200).json(result);
    });
  },

  // GET /customers/by_name?n=XXX&p=XXX
  showByName: function(req, res) {
    sortBy("name", req, res);
  },

  // GET /customers/by_registered_at?n=XXX&p=XXX
  showByRegisteredAt: function(req, res) {
    var number = req["query"]["n"];
    var pages = req["query"]["p"];
    Customer.find_by_sorted_date("registered_at", number, pages, function(err, result) {
      if (number && pages) {
        var select = []
        var offset = (pages - 1) * number;
        var start = parseInt(offset);
        var end = parseInt(offset) + parseInt(number);

        for (var i = start; i < end; i++) {
          select.push(result[i]);
          // console.log(select);
          if (i == (end - 1)) {
            return res.status(200).json(select);
          }
        }

        // var test = function(callback) {
        //   var jo = function() {
        //     var num_large_array = Array.apply(null, Array(number));
        //     // var selection = num_large_array.map(function (original_val, i) {return offset + i;});
        //     return num_large_array.map(function (original_val, i) {return offset + i;});
        //     // callback(selection);
        //   };
        //   console.log(callback)
        //   var selection = jo();
        //   console.log(selection);
        //   for (var i = selection[0]; i < (selection[0] + selection.length); i++) {
        //     select.push(result[i]);
        //     if (i == (selection[0] + selection.length - 1)) {
        //       return res.status(200).json(select);
        //     }
        //   }
        // };
        //
        // test();

        // test(function(selection) {
        //   for (var i = selection[0]; i < (selection[0] + selection.length); i++) {
        //     select.push(result[i]);
        //     if (i == (selection[0] + selection.length - 1)) {
        //       return res.status(200).json(select);
        //     }
        //   }
      // }
      } else {
        return res.status(200).json(result);
      }
    });
  },

  // GET /customers/by_postal_code?n=XXX&p=XXX
  showByPostalCode: function(req, res) {
    sortBy("postal_code", req, res);
  },

  // GET /customers/:id/current
  showCustomerCurrent: function(req, res) {
    showRentals(Customer.find_current, req, res);
  },

  // GET /customers/:id/history
  showCustomerHistory: function(req, res) {
    showRentals(Customer.find_history, req, res);
  }
};
