"use strict";
var Customer = require('../models/customer'); //class needs to be instantiated

exports.customersController = {
  index: function(req, res) {
    var db = new Customer();
    db.find_all(function(err, result) {
      return res.status(200).json(result);
    });
  },

  by_column: function(req, res) {
    var db = new Customer();
    db.by_column(req.params.column, req.params.n, req.params.p, function(err, result) {
      return res.status(200).json(result);
    });
  },

  movies_by_customer_current: function(req, res) {
    var db = new Customer();
    db.movies_by_customer_current(req.params.customer_id, function(err, result) {
      return res.status(200).json(result);
    });
  },

  movies_by_customer_history: function(req, res) {
    var db = new Customer();
    db.movies_by_customer_history(req.params.customer_id, function(err, result) {
      return res.status(200).json(result);
    });
  }
};
