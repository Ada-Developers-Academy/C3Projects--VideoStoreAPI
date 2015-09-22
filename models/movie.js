"use strict";

var Movie = function() { // movie constructor
  this.limit = 10; // we like ten
}

// function convertReleaseDate(arrayOfMovies) {
//   arrayOfMovies = arrayOfMovies.map(function(movie) {
//     var convertReleaseDate = Number(movie.release_date);
//     var dateOfRelease = new Date(convertReleaseDate);
//     var humanReadableDate = dateOfRelease.toDateString();
//     var humanReadableTime = dateOfRelease.toTimeString();
//     movie.release_date = humanReadableDate + " " + humanReadableTime;
//
//     return movie;
//   });


module.exports = Movie;
