"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';
var db = new sqlite3.Database('db/' + db_env + '.db');

exports.customersController = {
  // '/customers'
  all_customers: function(req, res) {
    db.all("SELECT * FROM customers;", function(err, rows) {
      res.status(200).json(rows)
    });
  },

  // '/customers/:sort_by/:results_per_page/:page_number'
  // :sort_by = (:name/:registered_at/:postal_code)

  sort_pages: function(req, res) {
    var statement = "SELECT * FROM customers ORDER BY " + req.params.sort_by + " ASC "
                    + "LIMIT " + req.params.results_per_page
                    + " OFFSET " + ((req.params.page_number - 1) * req.params.results_per_page)
                    + ";";

    db.all(statement, function(err, rows) {
      res.status(200).json(rows);
    });
  },

  // '/customers/:id/current'
  // '/current  and /previous'(should be able to see checkout & return date)
  search_current: function(req, res) {
    var statement = "SELECT * FROM customers WHERE id LIKE '%" + req.params.id + "%';";
    db.all(statement, function(err, rows) {
      var customerId = rows[0].id

      var statement = "SELECT * FROM rentals WHERE customer_id = "+ customerId + " AND return_date = '';";
      db.all(statement, function(err,rows){
        res.status(200).json(rows);
      });

    });
  },

  // '/customers/:id/previous'
  search_previous: function(req, res) {
    var statement = "SELECT * FROM customers WHERE id LIKE '%" + req.params.id + "%';";
    db.all(statement, function(err, rows) {
      var customerId = rows[0].id

      var statement = "SELECT * FROM rentals WHERE customer_id = "+ customerId + " AND return_date != '';";
      db.all(statement, function(err,rows){
        res.status(200).json(rows);
      });
    });
  }

}
