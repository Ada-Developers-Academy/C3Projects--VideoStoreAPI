"use strict";

var Rental = require('../models/rentals');

var Controller = {
  customers_current: function(req, res, next) {
    new Rental().customers_current(Controller.send_json.bind(res))
  },

  checkedout: function( req, res, next) {
    new Rental().checkout_history(req.params.title, 'IS NULL', '', Controller.send_json.bind(res))
  },

  title_history: function( req, res, next) {
    new Rental().checkout_history(req.params.title, 'IS NOT NULL', ' ORDER BY rentals.checkout_date DESC', Controller.send_json.bind(res))
  },

  id_history: function( req, res, next) {
    new Rental().checkout_history(req.params.title, 'IS NOT NULL', ' ORDER BY rentals.customer_id', Controller.send_json.bind(res))
  },

  name_history: function( req, res, next) {
    new Rental().checkout_history(req.params.title, 'IS NOT NULL', ' ORDER BY customers.name', Controller.send_json.bind(res))
  },

  checkout: function(req, res, next) {
    new Rental().checkoutMovie(req.params.title, req.params.customer_id, Controller.send_json.bind(res))
  },

  checkin: function(req, res, next) {
    new Rental().checkInMovie(req.params.title, req.params.customer_id, Controller.send_json.bind(res))
  },

  overdue: function(req, res, next) {
    new Rental().overdue(Controller.send_json.bind(res))
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
