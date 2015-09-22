"use strict";

function Movie() {
  this.table_name = "movies";
}

Movie.prototype = require('../database');
// var movie = new Movie();
// movie.find_by("title", "Jaws", function(err, res){});
// movie.find_all(function(err, res){});
// movie.sort_by("title", 30, 1, function(err, res){});
module.exports = Movie;


