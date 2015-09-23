"use strict";

var Customer = require('../models/customers');

var Controller = {
  index: function(req, res, callback) {
    new Customer().all(Controller.send_json.bind(res))
  },

  name: function(req, res, callback) {
    new Customer().some('name', req.params.offset, req.params.records, Controller.send_json.bind(res))
  },

  registered: function(req, res, callback) {
    new Customer().some('registered_at', req.params.offset, req.params.records, Controller.send_json.bind(res))
  },

  postal: function(req, res, callback) {
    new Customer().some('postal_code', req.params.offset, req.params.records, Controller.send_json.bind(res))
  },

  current: function(req, res, callback) {
   new Customer().find_by('customer_id', 'return_date IS NULL', req.params.id, Controller.send_json.bind(res))
  },

  history: function(req, res, callback) {
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
