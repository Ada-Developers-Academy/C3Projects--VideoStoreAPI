"use strict";
var Rental = require("../models/rental");
var Customer = require("../models/customer");
var Movie = require("../models/movie");

exports.rentalsController = {
  customersRentalHistory: function(req, res) {
    var rental = new Rental();
    var result = rental.customersRentalHistory(function(err,result){
    return res.status(200).json(result);
    });
  }
}
