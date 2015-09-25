"use strict";

var Rental = require('../models/rental');

var Controller = {
  create: function(req, res, next) {
    var rental = new Rental()
    rental.checkOut(req.body, Controller.sendJSON.bind(res));
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
