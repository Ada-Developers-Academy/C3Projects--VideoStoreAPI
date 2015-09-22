"use strict";

function convertHoursToMilliseconds(hours) {
  var millisecondsPerSecond = 1000;
  var secondsPerMinute = 60;
  var minutesPerHour = 60;

  var minutes = hours * minutesPerHour;
  var seconds = minutes * secondsPerMinute;
  var milliseconds =  seconds * millisecondsPerSecond;

  return milliseconds;
}

module.exports = convertHoursToMilliseconds;
