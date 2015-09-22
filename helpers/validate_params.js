"use strict";

// takes in a request body & an attribute
// does some super basic handling for sql injection
// returns an error or a null object and the validated params attribute
function validateParams(request, attr, callback) {
  var attribute = request.params[attr];
  attribute = attribute.split(";");
  // adsfasdfasdf -> ["adsfasdfasdf"]
  // asdfasdf;asdfasdf -> ["asdfasdf", "asdfasdf"]
  // asdfasdf; -> ["asdfasdf", ""]


  if (attribute.length > 1) {
    var error = { status: 400, message: "Request was malformed." };
    return callback(error);
  } else {
    return callback(null, attribute[0]);
  };
}

module.exports = validateParams;
