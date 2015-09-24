'use strict';

function sqlErrorHandling(error, data, callback) {
  var results = { meta: {} };

  if (error) {
    console.log("sqlErrorHandling error: " + error);
    results.data = {
      status: status = 500, // internal server error
      message: error
    }
  } else if (data.length == 0) { // handling for no results
    console.log("sqlErrorHandling data.length == 0, no results at all");
    results.data = {
      status: 303, // see other
      message: "No results found. You must query this endpoint with an exact title."
    }
    console.log("data length 0 results.data.message: " + results.data.message);
  } else { // no error!
    callback
    console.log("sqlErrorHandling no error, just sweet success!");
    return callback(null, results);
  };

  return callback(results);
}

module.exports = sqlErrorHandling;
