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
  }

}
