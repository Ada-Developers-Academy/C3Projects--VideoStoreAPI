"use strict";
var Rental = require('../models/rental'); //class needs to be instantiated

var rentalsController = {
  create: function(request, response, next) {
    var customer_id = request.body.id,
        movie_title = request.body.title,
        db = new Rental();

    db.check_out(customer_id, movie_title, function(err, result) {
      return response.status(200).json(result);
    });
  }
};

module.exports = rentalsController;
