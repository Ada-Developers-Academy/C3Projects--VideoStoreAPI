"use strict";

var Movie = require('../models/movie');

var Controller = {
  index: function(req, res, next) {
    if (req.query.sort) {
      new Movie().sortBy(req.query.sort, req.query.n, req.query.p, Controller.sendJSON.bind(res));
    } else {
      new Movie().all(Controller.sendJSON.bind(res));
    }
  },

  show: function(req, res, next) {
    new Movie().findBy('title', req.params.title, Controller.sendJSON.bind(res));
  },

  sendJSON: function(err, res) {
    if (err) {
      var status = err.status == 400 ? 400 : 500;
      this.status(status).json(err.message);
    } else {
      this.status(200).json(res);
    }
  }
}

module.exports = Controller;
