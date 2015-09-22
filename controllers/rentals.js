"use strict";

var Database = require('../database'); // Node module; Pulling in db object we made in a dif file

var rentalsController = {  

  rentals: function(req, callback) {
    var column = req.query.order_by ? req.query.order_by : "customer_id";
    var title = req.params.title   
    var statement = 
      "SELECT \
        rentals.id, rentals.title, rentals.customer_id, rentals.name, \
        rentals.checkout_date, rentals.due_date, rentals.return_date \
      FROM movies, rentals \
      WHERE rentals.movie_id = movies.id AND movies.title LIKE '%" + title + "%' \
      ORDER BY " + column + " ASC;";

    var db = new Database('db/development.db');

    db.query(statement, function(err, result) {

      var current_rentals_array = [];
      var previous_rentals_array = [];

      for(var i = 0; i < result.length; i++) {
        
        var rental = { 
          rental_id: result[i].id,
          movie_title: result[i].title,
          customer_id: result[i].customer_id,
          customer_name: result[i].name,
          checkout_date: result[i].checkout_date,
          due_date: result[i].due_date,
          return_date: result[i].return_date
        };

        if(rental.return_date == null) {
          current_rentals_array.push(rental);
        } else {
          previous_rentals_array.push(rental);
        };
      };

      var json_result = {
        current_rentals: current_rentals_array,
        previous_rentals: previous_rentals_array
      };

      callback(err, json_result);
    });
  },

  rentals_overdue: function(req, callback) {
    var statement =
      "SELECT \
        rentals.id, rentals.title, rentals.customer_id, rentals.name, \
        rentals.checkout_date, rentals.due_date, rentals.return_date \
      FROM movies, rentals \
      WHERE rentals.movie_id = movies.id \
        AND rentals.due_date < date('now') \
        AND rentals.return_date IS NULL \
      ORDER BY rentals.due_date ASC;"; 

    var db = new Database('db/development.db'); 
    
    db.query(statement, function(err, result) {

      var json_result = {
        overdue_movies: result
      };

      callback(err, json_result);
    });
  },

  checkout_movie: function(req, callback) {
    var customer_id = parseInt(req.params.customer_id);
    var movie_id = parseInt(req.params.movie_id);

    var post_rental_statement = 
      "INSERT INTO rentals (customer_id, name, movie_id, title, checkout_date, due_date, return_date) \
      VALUES (" + customer_id + ", 'test customer name', " + movie_id + ", 'test movie name', date('now'), date('now', '+7 days'), NULL); \
      UPDATE movies SET inventory_avail = inventory_avail - 1 WHERE ID = " + movie_id + "; \
      UPDATE customers SET account_credit = account_credit - 3 WHERE ID = " + customer_id + ";";

    var select_last_rental_statement = 
      "SELECT rentals.id, rentals.title, rentals.customer_id, rentals.name, rentals.checkout_date, rentals.due_date, rentals.return_date \
      FROM movies, rentals \
      ORDER BY rentals.id DESC \
      LIMIT 1";

// Test sql query
// INSERT INTO rentals (customer_id, name, movie_id, title, checkout_date, due_date, return_date) VALUES (2, 'test customer name', 12, 'test movie name', date('now'), date('now', '+7 days'), NULL); UPDATE movies SET inventory_avail = inventory_avail - 1 WHERE ID = 12; UPDATE customers SET account_credit = account_credit - 3 WHERE ID = 2; SELECT rentals.id, rentals.title, rentals.customer_id, rentals.name, rentals.checkout_date, rentals.due_date, rentals.return_date, movies.inventory_avail FROM movies, rentals ORDER BY rentals.id DESC LIMIT 1;    

    var db = new Database('db/development.db');         
    
    db.multi_query(post_rental_statement, function(err) { // no result, bc it's calling .exec (db.js file)

      db.query(select_last_rental_statement, function(err, result) {
        
        var json_result = {
          rental: result
        };
        
        callback(err, json_result);
      })
    });

  } // end of checkout_movie
};

module.exports = rentalsController;
