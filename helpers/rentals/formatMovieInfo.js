"use strict";

function formatMovieInfo(dataArray) {
  var movieInfo = dataArray[0]; // these should all be the same movie, so let's grab the first result.
  delete movieInfo.returned; // this removes the property returned, which is from the rentals table.
  return movieInfo;
}

module.exports = formatMovieInfo;
