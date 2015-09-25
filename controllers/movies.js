"use strict";

var Movie = require('../models/movie');

function titleSpaces(title) {
  return title.replace("_", " ");
}

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
  },

  current_rentals: function current_rentals(req, res, movie_title) {

    movie_title = titleSpaces(movie_title);

    var movie = new Movie();

    movie.movie_current_customers(movie_title, function(err, record) {
      res.status(200).json({ movie_current_customers: record });
    })
  },

  past_rentals: function past_rentals(req, res, movie_title, column) {

    movie_title = titleSpaces(movie_title);

    var movie = new Movie();

    movie.movie_past_customers(movie_title, column, function(err, record) {
      res.status(200).json({ movie_past_customers: record });
    })
  }
}
