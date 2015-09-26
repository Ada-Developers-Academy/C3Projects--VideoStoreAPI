"use strict";

var Customer = require('../models/customer');

var Controller = {
  index: function(req, res, next) {
    if (req.query.status == 'overdue') {
      new Customer().overdue(Controller.sendJSON.bind(res));
    } else if (req.query.sort) {
      new Customer().sortBy(req.query.sort, req.query.n, req.query.p, Controller.sendJSON.bind(res));
    } else {
      new Customer().all(Controller.sendJSON.bind(res));
    }
  },

  rentals: function(req, res, next) {
    new Customer().rentals(req.params.id, Controller.formatRentalsSendJON.bind(res));
  },

  formatRentalsSendJON: function(err, res) {
    var results = { current: [], past: [] };

    for (var i = 0; i < res.length; i++) {
      if (res[i].return_date) {
        results.past.push(res[i]);
      } else {
        results.current.push(res[i]);
      }
    }

    Controller.sendJSON.call(this, err, results);
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
