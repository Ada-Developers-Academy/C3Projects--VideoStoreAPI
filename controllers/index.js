"use strict";

//now this local variable is what was exported from the db database
// var Database = require('../database')

//the zomg function on line6 is the key to the pair that is the function
//giving the function the name getJson so we have a name if it breaks
exports.indexController = {

  zomg: function zomg(req,res) {
    var results = {
    zomg: "it works!"
    }
  return res.status(200).json(results);
  }
}
