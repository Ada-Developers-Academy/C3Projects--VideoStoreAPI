"use strict";

var ourWebsite = require("../url_base");

function addMovieToCustomerMetadata(dataArray) {
  console.log("i'm here")
  var customers = dataArray.data.customers;
  dataArray.data.customers = customers.map(function(customer) {
    var title = customer.data.movie_title;
    customer.meta.moreRentalInfo = ourWebsite + "/rentals/" + title;
    customer.meta.moreMovieInfo = ourWebsite + "/movies/" + title;
    return customer;
  })

  return dataArray;
}

module.exports = addMovieToCustomerMetadata;
