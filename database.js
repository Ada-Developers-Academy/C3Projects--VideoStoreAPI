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
        console.log(statement);
        console.log(err);
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
    AND rentals.overdue=1 AND rentals.check_in IS NULL;", function(res) {
      callback(res);
    });
  },

 // passing req.body to data
  check_out: function(data, callback) {
    // data will be an object with a key value pair with each item for rental
    var check_out_date = new Date();
    var check_out = formatDate(check_out_date);
    var due_date = new Date(check_out_date);
    due_date.setDate(check_out_date.getDate() + 3);
    var due = formatDate(due_date);
    var title = data.movie_title;
    var customer_id = data.customer_id;

    var db = new sqlite3.Database('db/' + db_env + '.db');
    db.exec(
    "BEGIN; \
    INSERT INTO " + this.table_name + "(check_out, check_in, due_date, overdue, movie_title, customer_id) \
    VALUES(" + check_out + ", null, " + due + ", 0, '" + title + "', " + customer_id +  "); \
    UPDATE movies SET inventory_available=inventory_available - 1 WHERE title='" + title + "'; \
    UPDATE customers SET account_credit=account_credit - 3 WHERE id=" + customer_id + "; \
    COMMIT;");
    db.close();
  },

  // data will include movie_title and customer_id
  check_in: function(data, callback) {
    var check_in_date = new Date();
    var check_in = formatDate(check_in_date);
    var title = data.movie_title;
    var customer_id = data.customer_id;

    var db = new sqlite3.Database('db/' + db_env + '.db');
    db.exec(
    // update rental: check_in_date and overdue
    // update movie: inventory_available
      "BEGIN; \
      UPDATE rentals SET check_in=" + check_in + ", overdue=0 WHERE movie_title='" + title + "'; \
      UPDATE movies SET inventory_available=inventory_available + 1 WHERE title='" + title + "'; \
      COMMIT;"
    );

    db.close();
  }
};

var formatDate = function(date) {
  var dateObj = new Date(date);
  var month = (dateObj.getUTCMonth() + 1).toString(); //months from 1-12
  var day = (dateObj.getUTCDate()).toString();
  var year = (dateObj.getUTCFullYear()).toString();

  if (month.length == 1) { // This will ensure month is two digits
    month = "0" + month;
  }

  if (day.length == 1) { // This will ensure day is two digits
    day = "0" + day;
  }

  return parseInt(year + month + day);
}
