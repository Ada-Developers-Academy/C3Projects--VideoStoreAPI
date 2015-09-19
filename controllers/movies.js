"use strict";

var Movie = require('../models/movie');

exports.moviesController = {
  index: function index(req, res) {

    var movie = new Movie();

    movie.find_all(function(err, record) {
      res.status(200).json({ all_movies: record });
    })
  },

  subset: function subset(req, res, column) {

    var movie = new Movie();

    movie.find_subset(column, 5, 0, function(err, record) {
      res.status(200).json({ subset_movies: record });
    })
  }
}
