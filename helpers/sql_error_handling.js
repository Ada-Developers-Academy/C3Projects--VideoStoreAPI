'use strict';

function sqlErrorHandling(error, data, callback) {
  var results = {};

  if (error) { // handling for sqlite3 error
    results.meta = {
      status: 500, // internal server error
      message: error
    }
  } else if (data.length == 0) { // handling for no results
    results.meta = {
      status: 303, // see other
      message: "ERROR"
    }
  } else { // no error here
    return callback(null, data);
  };

  return callback(results);
}

module.exports = sqlErrorHandling;
