"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env  = process.env.DB || 'development',
    db;

function addPercents(variable) {
  var percented = "%" + variable + "%";
  return percented;
}

exports.customersController = {
  customers: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    db.all("SELECT * FROM customers", function(err, all_customers) {
      db.close();
      return res.status(200).json(all_customers);
    });
  },

  customers_current_movies: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    var id = req.params.id;
    console.log("customer id " + id);
    db.all("SELECT movies.title FROM rentals \
    INNER JOIN movie_copies ON rentals.movie_copy_id = movie_copies.id \
    INNER JOIN movies ON movie_copies.movie_id = movies.id \
    WHERE rentals.customer_id = ? AND rentals.return_status = 0", id, function(err, the_movies) {
      if (err) {
        console.log(err);
      }
      db.close();
      return res.status(200).json(the_movies);
    });
  },

  customers_past_movies: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    var id = req.params.id;
    console.log("customer id " + id);
    db.all("SELECT movies.title, rentals.return_date FROM rentals \
    INNER JOIN movie_copies ON rentals.movie_copy_id = movie_copies.id \
    INNER JOIN movies ON movie_copies.movie_id = movies.id \
    WHERE rentals.customer_id = ? AND rentals.return_status = 1 \
    ORDER BY rentals.return_date", id, function(err, the_movies) {
      if (err) {
        console.log(err);
      }
      db.close();
      return res.status(200).json(the_movies);
    });
  },

  customers_by_name: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    var name = req.params.name;
    name = addPercents(name);
    db.all("SELECT * FROM customers WHERE name LIKE ?;", name, function(err, the_name) {
      db.close();
      console.log(arguments);
      return res.status(200).json(the_name);
    });

  },

  customers_by_register_date: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    var date = req.params.date;
    date = addPercents(date);
    db.all("SELECT * FROM customers WHERE registered_at LIKE ?;", date, function(err, the_date) {
      db.close();
      return res.status(200).json(the_date);
    });

  },

  customers_by_postal_code: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    var zipcode = req.params.zipcode;
    zipcode = addPercents(zipcode);
    db.all("SELECT * FROM customers WHERE postal_code LIKE ?;", zipcode, function(err, the_code) {
      db.close();
      return res.status(200).json(the_code);
    });

  },

};
