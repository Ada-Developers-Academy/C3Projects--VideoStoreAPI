"use strict";

var Movie = require('../models/movies'),
    sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development';

var Controller = {
  index: function(req, res, next) {
    new Movie().all(Controller.send_json.bind(res))
  },

  title: function(req, res, next) {
    new Movie().some('title', req.params.records, req.params.offset,
                     Controller.send_json.bind(res));
  },

  released: function(req, res, next) {
    new Movie().some('release_date DESC', req.params.records, req.params.offset,
                     Controller.send_json.bind(res));
  },

  available: function(req, res, next) {
    new Movie().movie_available(req.params.title, Controller.send_json.bind(res));
  },

  send_json: function(error, res) {
    if (error) {
      this.status(500).json(error);
    } else {
      this.status(200).json(res);
    }
  }
}

module.exports = Controller
