"use strict";

var sqlite3 = require('sqlite3').verbose(),
   Customer = require('../models/customer'),
    db_env  = process.env.DB || 'development',
    db;

function addPercents(variable) {
  var percented = "%" + variable + "%";
  return percented;
}

exports.customersController = {
  customers: function(req, res) {
    var customer = new Customer();
    customer.all(function(error, result) {
      return res.status(200).json(result);
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
    var name  = req.params.name,
        per_page = req.params.per_page,
        page  = req.params.pg;
        page  = page * per_page;

    name = addPercents(name);

    db.all("SELECT * FROM customers WHERE name LIKE ? ORDER BY name \
            LIMIT ? OFFSET ?;", name, per_page, page, function(err, the_name) {
      db.close();
      console.log(arguments);
      return res.status(200).json(the_name);
    });
  },

  customers_by_register_date: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    var date  = req.params.date,
        per_page = req.params.per_page,
        page  = req.params.pg;
        page  = page * per_page;


    date = addPercents(date);
    db.all("SELECT * FROM customers WHERE registered_at LIKE ? ORDER BY registered_at \
            LIMIT ? OFFSET ?;", date, per_page, page, function(err, the_date) {
      db.close();
      return res.status(200).json(the_date);
    });
  },

  customers_by_postal_code: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    var zipcode = req.params.zipcode,
        per_page = req.params.per_page,
        page    = req.params.pg;
        page    = page * per_page;

    zipcode = addPercents(zipcode);

    db.all("SELECT * FROM customers WHERE postal_code LIKE ? ORDER BY postal_code \
            LIMIT ? OFFSET ?;", zipcode, per_page, page, function(err, the_code) {
      db.close();
      return res.status(200).json(the_code);
    });
  },

};
