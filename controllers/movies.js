"use strict";
var Movie = require('../models/movie'); //class needs to be instantiated

exports.moviesController = {
  database_test: function(req, res) {
    var db = new Database(); // instantiates Database object
    db.test();

    return res.status(200).json(results);
  },

  index: function(req, res) {
    var db = new Movie();
    db.find_all(function(err, result) {

      return res.status(200).json(result);
    });
  }
};
