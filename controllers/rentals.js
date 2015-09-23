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
    var overdues = [];
    var overdue = 0;
    var overdueDays = 0;
    var overdueMonths = 0;

    for(var i = 0; i < result.length; i ++) {
      var returnedDate = result[i].returned_date; // "01-23-2015"
      var checkoutDate = result[i].checkout_date; // "01-26-2015"
      var rentalTime = result[i].rental_time; // "2"

      var checkoutDateArray = checkoutDate.split("-"); // ["01", "26", "2015"]
      var checkoutMonth = checkoutDateArray[0]; // "01"
      var checkoutDay = checkoutDateArray[1]; // "26"

      checkoutMonth = convertToDays(checkoutMonth);

      if(returnedDate != 'nil') {
        var returnedDateArray = returnedDate.split("-"); // ["01", "23", "2015"]
        var returnedMonth = returnedDateArray[0];
        var returnedDay = returnedDateArray[1];

        returnedMonth = convertToDays(returnedMonth);

        overdueMonths = returnedMonth - checkoutMonth;
        overdueDays = returnedDay - checkoutDay;
        overdue = overdueMonths + overdueDays - rentalTime;
        overdue = overdue < 0 ? 0:overdue;

        pushCustomerToArrayIfOverdue(result[i], overdue, overdues);

      } else {
          var date = new Date();
          var dateString = date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear();
          var dateStringArray = dateString.split("-");

          var currentMonth = dateStringArray[0];
          var currentDay = dateStringArray[1];

          currentMonth = convertToDays(currentMonth);

          overdueMonths = currentMonth - checkoutMonth;
          overdueDays = currentDay - checkoutDay;
          overdue = overdueMonths + overdueDays - rentalTime;
          overdue = overdue < 0 ? 0:overdue;

          pushCustomerToArrayIfOverdue(result[i], overdue, overdues);
      }
    }
    return res.status(200).json(overdues);
    });
  }
}
  function convertToDays(arg){
    var arg = arg;

    if (arg == "04" || arg ==  "06" || arg ==  "09" || arg ==  "11"){
      arg = "30";
    }else if (arg == "02") {
      arg = "28";
    }else {
      arg = "31";
    }
    return arg;
  }

  function pushCustomerToArrayIfOverdue(arg, overdue, overdues) {
    var overdue = overdue;
    var overdues = overdues;

    if (overdue > 0) {
      var customer = arg.name;
      var overdueInfo = {};
      overdueInfo[customer] = overdue + " days";
      overdues.push(overdueInfo);
    }
  }
