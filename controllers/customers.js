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
  }
};
