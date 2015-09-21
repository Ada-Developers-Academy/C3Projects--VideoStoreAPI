"use strict";

var Movie = require('../models/movie');

exports.moviesController = {
  index: function index(req, res) {

    var movie = new Movie();

    movie.find_all(function(err, record) {
      res.status(200).json({ all_movies: record });
    })
  },

  subset: function subset(req, res, column, pageNumber) {

    var movie = new Movie();

    var offset = (pageNumber - 1) * 50;

    movie.find_subset(column, 50, offset, function(err, record) {
      res.status(200).json({ movie_subset: record });
    })
  }
}
