"use strict";

var Movie = require('../movies');
var movie = new Movie();

exports.moviesController = {
  movies: function movies(req, res) {

    return res.status(200).json("it works!");
  },

  all: function all(req, res) {
    var movies = movie.all;

    return res.status(200).json(movies);
  }
}
