"use strict";

var Database = require('../database'); // Node module; Pulling in db object we made in a dif file

var customersController = {
  // ALL CUSTOMERS SEARCH...  "/customers?order_by=name"
  // PAGINATION...            "/customers?number=25&page=2"  => customers 26-50
  all_customers: function(req, callback) {
    var column = req.query.order_by ? req.query.order_by : "id";
    
    if (req.query.number && req.query.page) {
      var limit = req.query.number;
      var offset = req.query.page * limit - limit;
      var statement = "SELECT * FROM customers ORDER BY " + column + " ASC LIMIT " + limit + " OFFSET " + offset + ";";
    } else {
      var statement = "SELECT * FROM customers ORDER BY " + column + " ASC;";
    }
    
    var db_env = process.env.DB || 'development',
        db = new Database('db/' + db_env + '.db');

    db.query(statement, function(err, result) {

      var json_results = {
        customers: result
      };

      callback(err, json_results);
    });

  },

  customer: function(req, callback) {
    var statement = "SELECT * FROM customers, rentals WHERE customers.id = " + req.params.id + " AND rentals.customer_id = " + req.params.id + " ORDER BY rentals.checkout_date ASC;";    
    
    var db_env = process.env.DB || 'development',
        db = new Database('db/' + db_env + '.db');

    db.query(statement, function(err, result) {
      
      var customer_info = {
        id: result[0].customer_id,
        name: result[0].name,
        registered_at: result[0].registered_at,
        address: result[0].address,
        city: result[0].city,
        state: result[0].state,
        postal_code: result[0].postal_code,
        phone: result[0].phone,
        account_credit: result[0].account_credit
      };

      var renting_movies = [];
      var rented_movies = [];

      for(var i = 0; i < result.length; i++) {
        var movie = {
          id: result[i].movie_id,
          title: result[i].title,
          checkout_date: result[i].checkout_date,
          due_date: result[i].due_date,
          return_date: result[i].return_date
        };

        if(movie.return_date == null) {
          renting_movies.push(movie);
        } else {
          rented_movies.push(movie);
        }
      }

      var json_results = {   
        account: customer_info,
        renting: renting_movies,
        rented: rented_movies
      };

      callback(err, json_results);
    });
  }

};

module.exports = customersController;
