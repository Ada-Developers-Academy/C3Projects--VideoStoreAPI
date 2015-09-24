"use strict";

var Customer = require('../models/customer');

var Controller = {
  index: function(req, res, next) {
    if (req.query.status == 'overdue') {
      new Customer().overdue(Controller.sendJSON.bind(res));
    } else {
      new Customer().all(Controller.sendJSON.bind(res));
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
