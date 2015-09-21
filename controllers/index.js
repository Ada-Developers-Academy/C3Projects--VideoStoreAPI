"use strict";
var Movie = require("../models/movie.js");

exports.indexController = {
  zomg: function zomg(req,res) {
    var results = {
      zomg: "It works!",
    }
    return res.status(200).json(results);
  },

  displayAllMovies: function displayAllMovies(req, res) {
    var dbMovie = new Movie();
    var result = dbMovie.all_movies(function(err,result){});
    return res.status(200).send(result);
  }
}
