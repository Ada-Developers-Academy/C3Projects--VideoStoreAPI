"use-strict";
var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';

// Here we will define our instance methods
module.exports = {
  query: function(statement, callback) {
    var db = new sqlite3.Database('db/' + db_env + '.db');
    db.serialize(function() {
      // below: this is the callback pattern...parameters(ERRORS, RESULT)
      db.all(statement, function(err, res) {
        // console.log(statement);
        // console.log(err);
        // error handling looks like -> if (err) { };
        if (callback) { callback(res); }
      });
    });

    db.close();
  },

  all: function(callback) {
    this.query("SELECT * FROM " + this.table_name + ";", function(res) {
      callback(res);
    });
  },

  sort_by: function(sort_type, records_per_page, offset, callback) {
    this.query("SELECT * FROM " + this.table_name + " ORDER BY " + sort_type + " LIMIT " + records_per_page + " OFFSET " + offset + ";", function(res) {
     callback(res);
    });
  },

  // MOVIES
  movie_info: function(movie_title, callback) {
    this.query("SELECT * FROM " + this.table_name + " WHERE title LIKE '%" + movie_title + "%';", function(res) {
      callback(res);
    });
  },

  current_rentals: function(id, callback) {
    // list of current rentals out based on customer id
    this.query("SELECT * FROM rentals WHERE customer_id=" + id + " AND check_in IS NULL;", function(res) {
      callback(res);
    });
  },

  past_rentals: function(id, callback) {
    // list of past rentals based on customer id
    this.query("SELECT * FROM rentals WHERE customer_id=" + id + " AND check_in IS NOT NULL ORDER BY check_out" + ";", function(res) {
      callback(res);
    });
  },

  // CUSTOMERS
  current_customers: function(movie_title, callback) {
    this.query("SELECT customers.id, customers.name, customers.registered_at, \
                customers.address, customers.city, customers.state, \
                customers.postal_code, customers.phone, customers.account_credit \
                FROM customers, rentals \
                WHERE customers.id=rentals.customer_id \
                AND rentals.movie_title LIKE '%" + movie_title + "%' \
                AND rentals.check_in IS NULL;", function(res) {
      callback(res);
    });
  },

  past_customers: function(movie_title, callback) {
    this.query("SELECT customers.id, customers.name, customers.registered_at, \
                customers.address, customers.city, customers.state, \
                customers.postal_code, customers.phone, customers.account_credit \
                FROM customers, rentals \
                WHERE customers.id=rentals.customer_id \
                AND rentals.movie_title LIKE '%" + movie_title + "%' \
                AND rentals.check_in IS NOT NULL;", function(res) {
      callback(res);
    });
  },

  past_customers_sort: function(movie_title, sort_type, callback) {
    this.query("SELECT customers.id, customers.name, customers.registered_at, \
                customers.address, customers.city, customers.state, \
                customers.postal_code, customers.phone, customers.account_credit \
                FROM customers, rentals \
                WHERE customers.id=rentals.customer_id \
                AND rentals.movie_title LIKE '%" + movie_title + "%' \
                AND rentals.check_in IS NOT NULL \
                ORDER BY " + sort_type + ";", function(res) {
       callback(res);
     });
   },

  // RENTALS
  overdue: function(callback) {
    this.query("SELECT customers.id, customers.name, customers.registered_at, \
    customers.address, customers.city, customers.state, \
    customers.postal_code, customers.phone, customers.account_credit \
    FROM customers, rentals \
    WHERE customers.id=rentals.customer_id \
    AND rentals.overdue=1;", function(res) {
      callback(res);
    });
  },

 // passing req.body to data
  check_out: function(data, callback) {
    // data will be an object with a key value pair with each item for rental
    console.log(data);
    var check_out_date = new Date();
    var due_date = new Date(check_out_date);
    due_date.setDate(check_out_date.getDate() + 3);
    var movie_title = data.movie_title;
    var customer_id = data.customer_id;
    var statement = "INSERT INTO " + this.table_name + "(check_out, check_in, due_date, overdue, movie_title, customer_id) VALUES(" + check_out_date + ", null, " + due_date + ", 0, " + movie_title + ", " + customer_id +  ")"
    this.query(statement, function(res) {
      callback(res);
    });
    console.log(statement);
  }
}
