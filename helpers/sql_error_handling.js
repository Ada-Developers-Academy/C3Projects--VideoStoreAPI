'use strict';

function sqlErrorHandling(error, data) {
  var results = { meta: {} };
  var status;

  if (error) { // log error if error
    status = 500; // internal server error
    results.data = {
      status: status,
      message: error
    }
  } else if (data.length == 0) { // handling for no results
    status = 303; // see other
    results.data = {
      status: status,
      message: "No results found. You must query this endpoint with an exact title."
    }
  } else {
  return undefined, results;
  };

  return true, results;
}

module.exports = sqlErrorHandling;
