"use strict";

var sqlite3 = require('sqlite3').verbose(),
    Movie   = require('../models/movie'),
    db_env  = process.env.DB || 'development',
    db;

function addPercents(variable) {
  var percented = "%" + variable + "%";
  return percented;
}

exports.moviesController = {
  movies: function(req, res) {
    var movie = new Movie();
    movie.all(function(error, result) {
      return res.status(200).json(result);
    });
  },

  movies_by_title: function(req, res) {
    // db = new sqlite3.Database('db/' + db_env + '.db');
    // db.all("SELECT * FROM movies WHERE title LIKE ?;", title, function(err, the_title) {
    //   db.close();
    var title = req.params.title.toLowerCase(),
        movie = new Movie();
        title = addPercents(title);
    movie.find_by("title", title, function(error, result) {
      return res.status(200).json(result);
    });
  },

  current_renters_by_title: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    var title = req.params.title.toLowerCase(),
        order = req.params.order.toLowerCase();
        title = addPercents(title);

    var order_by_statement = "";

    if(order == "id") {
      order_by_statement = "ORDER BY customers.id";
    }
    else if(order == "name") {
      order_by_statement = "ORDER BY customers.name";
    }
    else if(order == "checkout") {
      order_by_statement = "ORDER BY rentals.checkout_date";
    }

    db.all("SELECT customers.name FROM rentals \
            INNER JOIN movie_copies ON rentals.movie_copy_id = movie_copies.id \
            INNER JOIN movies ON movie_copies.movie_id = movies.id \
            INNER JOIN customers ON rentals.customer_id = customers.id \
            WHERE movies.title LIKE ? AND return_status = 0 " + order_by_statement + ";",
            title, function(err, the_movie) {
      db.close();
      return res.status(200).json(the_movie);
    });
  },

  past_renters_by_title: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    var title = req.params.title.toLowerCase(),
        order = req.params.order.toLowerCase();
        title = addPercents(title);

    var order_by_statement = "";

    if(order == "id") {
      order_by_statement = "ORDER BY customers.id";
    }
    else if(order == "name") {
      order_by_statement = "ORDER BY customers.name";
    }
    else if(order == "checkout") {
      order_by_statement = "ORDER BY rentals.checkout_date";
    }

    db.all("SELECT customers.name FROM rentals \
            INNER JOIN movie_copies ON rentals.movie_copy_id = movie_copies.id \
            INNER JOIN movies ON movie_copies.movie_id = movies.id \
            INNER JOIN customers ON rentals.customer_id = customers.id \
            WHERE movies.title LIKE ? AND return_status = 1 " + order_by_statement + ";",
            title, function(err, the_movie) {
      db.close();
      return res.status(200).json(the_movie);
    });
  },

  movies_by_release: function(req, res) {
    db = new sqlite3.Database('db/' + db_env + '.db');
    var release = req.params.release_date;
    release = addPercents(release);
    db.all("SELECT * FROM movies WHERE release_date ?;", release, function(err, the_date) {
      db.close();
      return res.status(200).json(the_date);
    });
  }

}; // end
