"use strict";

exports.customerController = {
  index: function index(req, res) {
    // return list of all customers, GET verb
    // var results = {
    //   zomg: 'zomg it worked!',
    //   moar: 'zomg moar'
    }
    // return res.status(200).json(results);
  },

  one_customer: function one_customer(req, res) {
    return res.status(200).json({why: "I don't know."});
  }
}
