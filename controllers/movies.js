"use strict";
var Movie = require("../models/movie.js");

exports.moviesController = {
  findAllMovies: function(req, res) {
    var dbMovie = new Movie();
    var result = dbMovie.find_all(function(err,result){
    return res.status(200).json(result);
    });
  }
}
