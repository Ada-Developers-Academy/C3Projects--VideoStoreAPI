"use strict";

function convertRegisteredAt(objectsArray, propertyToConvert) {
  objectsArray = objectsArray.map(function(customer) {
    var stringMilliseconds = customer[propertyToConvert];
    var numericMilliseconds = Number(stringMilliseconds);
    var dateForm = new Date(numericMilliseconds);
    var humanReadableDate = dateForm.toDateString();
    var humanReadableTime = dateForm.toTimeString();

    customer[propertyToConvert] = humanReadableDate + " " + humanReadableTime;

    return customer;
  });

  return objectsArray;
}

module.exports = convertRegisteredAt;
