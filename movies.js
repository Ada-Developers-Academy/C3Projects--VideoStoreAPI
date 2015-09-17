"use-strict";
var sqlite3 = require('sqlite3').verbose();
var Database = require('./database');

function Movie() {}

Movie.prototype = {
  all: function() {
    console.log("hello");
    var db = new Database();

    db.serialize(function() {
      // var movies = db.query("SELECT * FROM movies;");
      movies = db.test();
      console.log("This should be yay it works: " + movies);
    });

    return movies;
  }
}

module.exports = Movie;
