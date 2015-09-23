"use strict";

var Customer = require('../models/customers');

var Controller = {
  index: function(req, res, next) {
    new Customer().all(Controller.send_json.bind(res))
  },

  name: function(req, res, next) {
    new Customer().some('name', req.params.records, req.params.offset, Controller.send_json.bind(res))
  },

  registered: function(req, res, next) {
    new Customer().some('registered_at', req.params.records, req.params.offset, Controller.send_json.bind(res))
  },

  postal: function(req, res, next) {
    new Customer().some('postal_code', req.params.records, req.params.offset, Controller.send_json.bind(res))
  },

  current: function(req, res, next) {
   new Customer().find_by('customer_id', 'return_date IS NULL', req.params.id, Controller.send_json.bind(res))
  },

  history: function(req, res, next) {
   new Customer().find_by('customer_id', 'return_date IS NOT NULL ORDER BY checkout_date', req.params.id, Controller.send_json.bind(res))
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
