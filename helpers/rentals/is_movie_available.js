"use strict";

function isMovieAvailable(dataArray) {
  // the dataArray should be all about the same movie, so let's grab the first result's inventory.
  var inventory = dataArray[0].inventory;
  var notReturned = dataArray.filter(function(dataItem) {
    // we're using 1 for true & 0 for false in this boolean column.
    // right now, we only care about the items that haven't been returned.
    return dataItem.returned == 0;
  })

  // if inventory is greater than the number of unreturned movies, then we have a copy available for rent.
  return inventory > notReturned.length;
}

module.exports = isMovieAvailable;
