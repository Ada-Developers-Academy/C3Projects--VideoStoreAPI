"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development';

// // example data
  // {
  //   movies: [
  //     { title: 'Movie1', overview: 'Descr1', release_date: '1975-06-19', inventory: 10 },
  //     { title: 'Movie2', overview: 'Descr2', release_date: 'Yesterday', inventory: 11 },
  //     { title: 'Movie3', overview: 'Descr3', release_date: 'Yesterday', inventory: 11 }
  //   ],
  //   customers: [
  //     { name: 'Customer1', registered_at: '01/02/2015', address: 'Address1', city: 'City1', state: 'State1', postal_code: 'Zip1', phone: 'Phone1', account_balance: '1250' },
  //     { name: 'Customer2', registered_at: '12/01/2014', address: 'Address2', city: 'City2', state: 'State2', postal_code: 'Zip2', phone: 'Phone2', account_balance: '1000' }
  //   ],
  //   rentals: [
  //     { checkout_date: '2015-09-16', return_date: '', movie_title: 'Movie1', customer_id: 1 },
  //     { checkout_date: '2015-03-16', return_date: '2015-03-20', movie_title: 'Movie2', customer_id: 1 },
  //     { checkout_date: '2015-09-18', return_date: '', movie_title: 'Movie3', customer_id: 2 }
  //   ]
  // }

function resetAllTables(data, done) {
  var db = new sqlite3.Database('db/' + db_env + '.db');

  var movies = data.movies;
  var customers = data.customers;
  var rentals = data.rentals;

  db.serialize(function resetTables() {
    db.exec('BEGIN TRANSACTION;');

    db.exec('DELETE FROM movies;');

    // NOTE: movies, customers, and rentals are all optional. Can seed just one, or all three.
    if (movies) {
      var statement = db.prepare(
        'INSERT INTO movies (title, overview, release_date, inventory) \
        VALUES (?, ?, ?, ?);'
      );

      for (var i = 0; i < movies.length; i++) {
        var movie = movies[i];

        statement.run(
          movie.title,
          movie.overview,
          movie.release_date,
          movie.inventory
        );
      }

      statement.finalize();
    }

    db.exec('DELETE FROM customers;');

    if (customers) {
      var statement = db.prepare(
        'INSERT INTO customers (name, registered_at, address, city, state, postal_code, phone, account_balance) \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);'
      );

      for (var i = 0; i < customers.length; i++) {
        var customer = customers[i];

        statement.run(
          customer.name,
          customer.registered_at,
          customer.address,
          customer.city,
          customer.state,
          customer.postal_code,
          customer.phone,
          customer.account_balance
        );
      }

      statement.finalize();
    }

    db.exec('DELETE FROM rentals;');

    if (rentals) {
      db.exec('PRAGMA defer_foreign_keys = ON');

      var statement = db.prepare(
        'INSERT INTO rentals (checkout_date, return_date, movie_title, customer_id) \
        VALUES (?, ?, ?, ?);'
      );

      for (var i = 0; i < rentals.length; i++) {
        var rental = rentals[i];

        statement.run(
          rental.checkout_date,
          rental.return_date,
          rental.movie_title,
          rental.customer_id
        );
      }

      statement.finalize();
    }

    db.exec('COMMIT TRANSACTION;', function(err) {
      db.close();
      done(err);
    });
  });
}

module.exports = resetAllTables;
