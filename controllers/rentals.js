"use strict";
var Rental = require('../models/rental'); //class needs to be instantiated

exports.rentalsController = {
  check_out: function(req, res) {
    var db = new Rental();
    db.check_out(req.params.id, req.params.title, function(err, result) {

      return res.status(200).json(result);
    });
  }
};
