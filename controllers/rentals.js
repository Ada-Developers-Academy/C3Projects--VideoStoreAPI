"use strict";

var Rental = require('../models/rental');

exports.rentalsController = {
  find_movie: function find_movie(req, res, movie_title) {

    var rental = new Rental();

    rental.movie_details(movie_title, function(err, record) {
      res.status(200).json({ movie_details: record });
    })
  },
}
