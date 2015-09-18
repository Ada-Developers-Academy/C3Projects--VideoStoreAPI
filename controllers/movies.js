"use strict";

var Movie = require('../movies');

exports.moviesController = {
  movies: function movies(req, res) {

    return res.status(200).json("it works!");
  },

  all: function all(req, res) {
    var movie = new Movie();
    var movies = movie.all(function(movies) {
      return res.status(200).json(movies);
    });
  }
}
