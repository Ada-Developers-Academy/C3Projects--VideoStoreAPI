"use strict";
var movieTable = require('../models/movie');
var sqlite3 = require("sqlite3").verbose();
var dbEnv = process.env.DB || "development";


module.exports = {
  test: function(request, response) {
    var results = {
      it_works: "it works!",
      no_really: "no, really!"
    }
    return response.status(200).json(results);
  },

  // this is all movies
  all_movies: function(request, response) {
    console.log("inside all_movies");
    var db = new sqlite3.Database("db/" + dbEnv + ".db");
    var movies = new movieTable();
    console.log(movies);

    // prepare statement
    var pageNumber = request.params.page; // we still need to handle for page 1
    var offset = (pageNumber - 1) * movies.limit;
    var statement = "SELECT * FROM movies LIMIT " + movies.limit +
      " OFFSET " + offset + ";";
      console.log('statement' + statement);

    db.all(statement, function(err, results) { // closure
      if(err) {
        console.log(err); // error handling
        return;
      }
      console.log('results are: ' + results);
      return response.status(200).json(results);
    });

    db.close();
  },

  release_date: function(request, response) {
    function convertReleaseDate(arrayOfMovies) {
    console.log("INSIDE RELEASE DATE!");
      arrayOfMovies = arrayOfMovies.map(function(movie) {
        var convertReleaseDate = Number(movie.release_date);
        var dateOfRelease = new Date(convertReleaseDate);
        var humanReadableDate = dateOfRelease.toDateString();
        var humanReadableTime = dateOfRelease.toTimeString();

        movie.release_date = humanReadableDate + " " + humanReadableTime;
        console.log('humanReadableDate' + humanReadableDate);
        return movie;
      });

      return arrayOfMovies;
    }

    var db = new sqlite3.Database("db/" + dbEnv + ".db");
    var movies = new movieTable();

    // prepare statement
    var pageNumber = request.params.page; // we still need to handle for page 1
    var offset = (pageNumber - 1) * movies.limit;
    var statement = "SELECT * FROM movies ORDER BY (release_date) LIMIT "
      + movies.limit + " OFFSET " + offset + ";";
      console.log(statment);

    db.all(statement, function(err, results) { // closure
      if(err) {
        console.log(err); // error handling
        return;
      }
      results = convertReleaseDate(results);

      return response.status(200).json(results);
    });

    db.close();
  }

}
