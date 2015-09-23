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

    console.log(result[0].rental_time)
    for(var i = 0; i < result.length; i ++) {
      var returnedDate = result[i].returned_date; // "01-23-2015"
      var checkoutDate = result[i].checkout_date; // "01-26-2015"
      var rentalTime = result[i].rental_time; // "2"

      var checkoutDateArray = checkoutDate.split("-"); // ["01", "26", "2015"]
      var checkoutMonth = checkoutDateArray[0]; // "01"
      var checkoutDay = checkoutDateArray[1]; // "26"

      if (checkoutMonth == "04" || checkoutMonth ==  "06" || checkoutMonth ==  "09" || checkoutMonth ==  "11"){
        checkoutMonth = "30";
      }else if (checkoutMonth == "02") {
        checkoutMonth = "28";
      }else {
        checkoutMonth = "31";
      }

      if(returnedDate != 'nil') {
        console.log("got here")
        var returnedDateArray = returnedDate.split("-"); // ["01", "23", "2015"]
        var returnedMonth = returnedDateArray[0];
        var returnedDay = returnedDateArray[1];

        if (returnedMonth == "04" || returnedMonth ==  "06" || returnedMonth ==  "09" || returnedMonth ==  "11"){
          returnedMonth = "30";
        }else if (returnedMonth == "02") {
          returnedMonth = "28";
        }else {
          returnedMonth = "31";
        }

        overdueMonths = returnedMonth - checkoutMonth;
        overdueDays = returnedDay - checkoutDay;
        overdue = overdueMonths + overdueDays - rentalTime;
        overdue = overdue < 0 ? 0:overdue;

        if (overdue > 0) {
          var customer = result[i].name;
          var overdueInfo = {};
          overdueInfo[customer] = overdue + " days";
          overdues.push(overdueInfo);
        }

      } else {
          var date = new Date();
          var dateString = date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear();
          var dateStringArray = dateString.split("-");

          var currentMonth = dateStringArray[0];
          var currentDay = dateStringArray[1];

          if (currentMonth == "04" || currentMonth ==  "06" || currentMonth ==  "09" || currentMonth ==  "11"){
            currentMonth = "30";
          }else if (currentMonth == "02") {
            currentMonth = "28";
          }else {
            currentMonth = "31";
          }

        overdueMonths = currentMonth - checkoutMonth;
        overdueDays = currentDay - checkoutDay;
        overdue = overdueMonths + overdueDays - rentalTime;
        overdue = overdue < 0 ? 0:overdue;

        if (overdue > 0) {
          var customer = result[i].name;
          var overdueInfo = {};

          overdueInfo[customer] = overdue + " days";
          overdues.push(overdueInfo);
        }
      }
      // console.log(result[i]);
      // console.log(overdue);
      // console.log(overdues)
    }

    return res.status(200).json(overdues);
    });
  }
}
