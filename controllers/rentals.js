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
  },

  customersOverdue: function(req, res) {
    var rental = new Rental();
    var result = rental.customersRentalHistory(function(err,result){
    var checkoutDates = [];
    var returnedDates = [];
    var overdues = [];
    var overdue = 0;

    for(var i = 0; i < result.length; i ++) {
      var returnedDate = result[i].returned_date; // "01-23-2015"
      var checkoutDate = result[i].checkout_date; // "01-26-2015"
      checkoutDates.push(checkoutDate);
      returnedDates.push(returnedDate);

      var checkoutDateArray = checkoutDate.split("-"); // ["01", "26", "2015"]

      if(returnedDate != 'nil') {
        var returnedDateArray = returnedDate.split("-"); // ["01", "23", "2015"]
        overdue = returnedDateArray[1] - checkoutDateArray[1] - "3";
        overdue = overdue < 0 ? 0:overdue;
        overdues.push(overdue);
      } else {
        var date = new Date();
        var dateString = date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear();
        var dateStringArray = dateString.split("-");

        overdue = dateStringArray[1] - checkoutDateArray[1] - "3";
        overdue = overdue < 0 ? 0:overdue;
        overdues.push(overdue);
      }

      console.log(result[i]);
      console.log(overdue);
    }

    return res.status(200).json(overdues);
    });
  }
}
