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
    new Movie().findBy('title', req.params.title, Controller.formatThenSendJSON.bind(res));
  },

  formatThenSendJSON: function(err, results) {
    new Movie().numAvail(results[0].title, function(err, otherResults) {
      results = results[0];
      results.num_available = otherResults[0].num_available;

      Controller.sendJSON.apply(this, [err, results]);

    }.bind(this));

  },

  customers: function(req, res, next) {
    if (req.query.status == 'current') {
      new Movie().customersCurrent(req.params.title, Controller.sendJSON.bind(res));
    } else if (req.query.status == 'past') {
      new Movie().customersPast(req.params.title, req.query.sort, Controller.sendJSON.bind(res));
    } else {
      res.status(400).json("Bad request");
    }
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
