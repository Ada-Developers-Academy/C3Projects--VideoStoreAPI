"use strict";

var Movie = require('../movies');
var movie = new Movie();

var sortMovies = function (sort_type, params, res) {
  var records_per_page = params.records_per_page;
  var offset = params.offset;
  var movies = movie.sort_by(sort_type, records_per_page, offset, function(movies){
    return res.status(200).json(movies);
  });
}

exports.moviesController = {

  all: function all(req, res) {
    var movies = movie.all(function(movies) {
      return res.status(200).json(movies);
    });
  },

  release_date_sort: function release_date_sort(req, res) {
    var sort_type = "release_date";
    sortMovies(sort_type, req.params, res);
  },

  title_sort: function title_sort(req, res) {
    var sort_type = "title";
    sortMovies(sort_type, req.params, res);
  },

  movie_info: function movie_info(req, res) {
    var movie_title = req.params.title;

    movie.movie_info(movie_title, function(movie_info) {
      return res.status(200).json(movie_info);
    });
  },

  current_customers: function current_customers(req, res) {
    var movie_title = req.params.title;

    movie.current_customers(movie_title, function(current_customers) {
      return res.status(200).json(current_customers);
    });
  },

  past_customers: function past_customers(req, res) {
    var movie_title = req.params.title;

    movie.past_customers(movie_title, function(past_customers) {
      return res.status(200).json(past_customers);
    });
  }
}
