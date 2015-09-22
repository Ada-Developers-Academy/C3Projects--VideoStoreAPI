"use strict";

// takes in a request body & an attribute
// does some super basic handling for sql injection
// returns an error or a null object and the validated params attribute
function validateParams(req, attr, callback) {
  var attribute = req.params[attr];
  attribute = attribute.split(";");

  if (attribute.length > 1) {
    var err = { status: 400, message: "Request was malformed." };
    return callback(err);
  } else {
    return callback(null, attribute[0]);
  };
}

module.exports = validateParams;
