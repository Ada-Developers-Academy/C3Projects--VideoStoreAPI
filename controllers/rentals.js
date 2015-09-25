"use strict";

var Rental = require('../models/rental');

var Controller = {
  create: function(req, res, next) {
  },

  update: function(req, res, next) {
    new Rental().checkIn(req.body.movie_title, req.body.return_date, req.params.customer_id, Controller.sendJSON.bind(res))
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
