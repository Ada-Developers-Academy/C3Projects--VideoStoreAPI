"use strict";

// takes in a request body & an attribute
// does some super basic handling for sql injection
// returns an error or a null object and the validated params attribute
function validateParams(request, attr, callback) {
  console.log("i'm in validateparams");
  var attribute = request.params[attr];
  attribute = attribute.split(";");
  // adsfasdfasdf -> ["adsfasdfasdf"]
  // asdfasdf;asdfasdf -> ["asdfasdf", "asdfasdf"]
  // asdfasdf; -> ["asdfasdf", ""]
  
  console.log("attribute: " + attribute);
  console.log("attribute.length: " + attribute.length);

  if (attribute.length > 1) {
    var error = { status: 400, message: "Request was malformed." };
    console.log("fail");
    return callback(error);
  } else {
    console.log("pass");
    return callback(null, attribute[0]);
  };
}

module.exports = validateParams;
