"use strict";

exports.rentalsController = {
  checkedout: function checkedout(req,res) {
    var results = {
      // for a movie, all customers w/ it checked out
    }
  return res.status(200).json(results);
  },

  title_history: function title_history(req,res) {
    var results = {
      // for a movie, all customers w/ that movie previously checked out
      // sorted by check out date
    }
  return res.status(200).json(results);
  },

  id_history: function id_history(req,res) {
    var results = {
      // for a movie, all customers w/ that movie previously checked out
      // sorted by
    }
  return res.status(200).json(results);
  },

  name_history: function name_history(req,res) {
    var results = {
      // for a movie, all customers w/ that movie previously checked out
      // sorted by
    }
  return res.status(200).json(results);
  },

  customers_current: function customers_current(req,res) {
    var results = {
      // all customers that have currently checked out queried title
    }
  return res.status(200).json(results);
  },

  checkout: function checkout(req,res) {
    var results = {
      // checkout movie to id customer, (make a new rental record)
        // checkout date = Date.now, due_date = Date.now +3, return_date = null
        // overdue =0, movie_id: get id of title, customer_id: params
      // charge the customers account credit
        // update table record for account credit update account_credit = account_credit -2 from customers where id = params
    }
  return res.status(200).json(results);
  },

  checkin: function checkin(req,res) {
    var results = {
      // check if return_date == nil
      // update rentals table for given customer_id and movie_title (only works if exact) return date = Date.now
      // overdue check is due date before date.now, overdue == 1, else ==0
    }
  return res.status(200).json(results);
  },

  overdue: function overdue(req,res) {
    var results = {
      // customers where overdue ==1, add
      // customers where return_date = nil, if Date.now is after due_date
    }
  return res.status(200).json(results);
  }
}
