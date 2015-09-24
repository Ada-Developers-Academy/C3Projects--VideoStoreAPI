"use strict";

var sqlite3 = require('sqlite3').verbose();
var db_env = process.env.DB || 'development';
var db = new sqlite3.Database('db/' + db_env + '.db');
var Movie = require('../models/movies');

exports.moviesController = {

  // GET /movies
  getAllMovies: function(res) {
    db.all("SELECT title, overview, release_date, inventory FROM movies", function(err, rows) {
      if (err !== null) {
        console.log(err);
      }
      res.status(200).json(rows);
    });
  },

  // Get /movies/id/:id(synopsis, inventory, release_date)
  getMovieById: function(id, res) {
    db.all("SELECT title, overview, release_date, inventory FROM movies WHERE id=?", id, function(err, rows) {
      if (err !== null) {
        console.log(err);
      }
      res.status(200).json(rows);
    });
  },

  // GET /movies/title/:title
  getMovieByTitle: function(title, res) {
    db.all("SELECT title, overview, release_date, inventory FROM movies WHERE title LIKE ?", title, function(err, rows) {
      if (err !== null) {
        console.log(err);
      }
      res.status(200).json(rows);
    });
  },

  // GET /movies/title/:title/:inventory
  getMovieByTitleInventory: function(title, res) {
    db.all("SELECT title, inventory FROM movies WHERE title LIKE ?", title, function(err, rows) {
      if (err !== null) {
        console.log(err);
      }
      res.status(200).json(rows);
    });
  },

  // GET /movies/release_date?n=XXX&p=XXX
  getMoviesByReleaseDate: function(num, page, res) {
    var callback = function(err, rows) {
      if (err !== null) {
        console.log(err);
      }
      res.status(200).json(rows);
    };

    // This is the case when no query parameters are given
    if (num === undefined && page === undefined) {
      db.all("SELECT title, overview, release_date, inventory FROM movies ORDER BY release_date DESC", callback);
    }
    // This is the case when only n is given
    else if (page === undefined) {
      db.all("SELECT title, overview, release_date, inventory FROM movies ORDER BY release_date DESC LIMIT ?", num, callback);
    }
    else {
      // Assume both num and page are specified
      db.all("SELECT title, release_date FROM movies WHERE id NOT IN ( SELECT id FROM movies ORDER BY release_date DESC LIMIT ?) ORDER BY release_date DESC LIMIT ?", (page - 1) * num, num, callback);
    }
  },

  // GET /movies/title?n=XXX&p=XXX
  getMoviesByTitle: function(num, page, res) {
    var callback = function(err, rows) {
      if (err !== null) {
        console.log(err);
      }
      res.status(200).json(rows);
    };

    // This is the case when no query parameters are given
    if (num === undefined && page === undefined) {
      db.all("SELECT title, overview, release_date, inventory FROM movies ORDER BY title ASC", callback);
    }
    // This is the case when only n is given
    else if (page === undefined) {
      db.all("SELECT title, overview, release_date, inventory FROM movies ORDER BY title ASC LIMIT ?", num, callback);
    }
    else {
      // Assume both num and page are specified
      db.all("SELECT title, overview, release_date, inventory FROM movies WHERE id NOT IN ( SELECT id FROM movies ORDER BY title ASC LIMIT ?) ORDER BY title ASC LIMIT ?", (page - 1) * num, num, callback);
    }
  },

  // GET /movies/title/:title/checked_out_current
  getCheckedOutCustomersByTitle: function(title, res) {
    db.all("SELECT customers.id, customers.name, customers.phone, rentals.check_out_date FROM customers INNER JOIN rentals ON customers.id = rentals.customer_id INNER JOIN movies ON movies.id = rentals.movie_id WHERE movies.title LIKE ? AND rentals.check_in_date IS NULL", title, function(err, rows) {
      if (err !== null) {
        console.log(err);
      }console.log(rows);
      res.status(200).json(rows);
    });
  },

  // GET /movies/title/:title/checked_out_history?ordered_by=XXX
  // ordered_by id, name, check out date
  getCheckedOutHistoryByTitle: function(title, ordered_by, res) {

    var order = "customers.id";
    if (ordered_by == "id") {
      order = "customers.id";
    }
    else if (ordered_by == "name")
      order = "customers.name";
    else if (ordered_by == "check_out_date" || ordered_by == "checkout_date")
      order = "rentals.check_out_date";
    else if (ordered_by !== undefined)
      order = ordered_by;

    var statement =
      "SELECT customers.id, customers.name, customers.phone, rentals.check_out_date \
      FROM customers INNER JOIN rentals ON customers.id = rentals.customer_id INNER JOIN movies ON movies.id = rentals.movie_id \
      WHERE movies.title LIKE ? AND rentals.check_in_date IS NOT NULL ORDER BY " + order;

// SELECT customers.id, customers.name, customers.phone, rentals.check_out_date FROM customers INNER JOIN rentals ON customers.id = rentals.customer_id INNER JOIN movies ON movies.id = rentals.movie_id WHERE movies.title LIKE 'psycho' AND rentals.check_in_date IS NOT NULL ORDER BY customers.id;
    db.all(statement, title, function(err, rows) {
      if (err !== null) {
        console.log(err);
      }console.log(rows);
      res.status(200).json(rows);
    });
  }
}
