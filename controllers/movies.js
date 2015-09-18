"use strict";

var Movie = require('../movies');

exports.moviesController = {

  all: function all(req, res) {
    var movie = new Movie();
    var movies = movie.all(function(movies) {
      return res.status(200).json(movies);
    });
  }
}
