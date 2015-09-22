"use strict";
var Movie = require('../models/movie'); //class needs to be instantiated

exports.moviesController = {
  index: function(req, res) {
    var db = new Movie();
    db.find_all(function(err, result) {

      return res.status(200).json(result);
    });
  },

  by_column: function(req, res) {
    var db = new Movie();
    db.by_column(req.params.column, req.params.n, req.params.p, function(err, result) {
      return res.status(200).json(result);
    });
  },

  customers_by_movie_current: function(req, res) {
    var db = new Movie();
    db.customers_by_movie_current(req.params.title, function(err, result) {
      return res.status(200).json(result);
    });
  },

  movie_info: function(req, res) {
    var db = new Movie();
    db.movie_info(req.params.title, function(err, result) {
      return res.status(200).json(result);
    });
  },

  customers_by_movie_history: function(req, res) {
    var db = new Movie();
    db.customers_by_movie_history(req.params.title, function(err, result) {
      return res.status(200).json(result);
    });
  }
};
