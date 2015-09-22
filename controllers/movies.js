"use strict";
var Movie = require("../models/movie.js");

exports.moviesController = {
  findAllMovies: function(req, res) {
    var dbMovie = new Movie();
    var result = dbMovie.find_all(function(err,result){
    return res.status(200).json(result);
    });
  },

  findMovieByTitle: function(req, res) {
    var dbMovie = new Movie();
    var value = req.params.title;
    console.log(value);
    var result = dbMovie.find_by("title", value, function(err,result){
    return res.status(200).json(result);
    });
  },

  sortMoviesByTitle: function(req, res) {
    var dbMovie = new Movie();
    var limit = req.params.limit;
    var offset = req.params.offset;
    var result = dbMovie.sort_by("title", limit, offset, function(err,result){
    return res.status(200).json(result);
    });
  },

  sortMoviesByReleaseDate: function(req, res) {
    var dbMovie = new Movie();
    var limit = req.params.limit;
    var offset = req.params.offset;
    var result = dbMovie.sort_by("release_date", limit, offset, function(err,result){
    return res.status(200).json(result);
    });
  },

  availableMovies: function(req, res) {
    var dbMovie = new Movie();
    var title = req.params.title;
    var result = dbMovie.available(title, function(err,result){
    return res.status(200).json(result);
    });
  }
}
