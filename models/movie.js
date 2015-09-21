"use strict";

function Movie() {
  this.table_name = "movies";
}

Movie.prototype = require('../database');
var movie = new Movie();
movie.find_by("title", "Jaws", function(err, res){});
movie.all_movies(function(err, res){});
module.exports = Movie;
