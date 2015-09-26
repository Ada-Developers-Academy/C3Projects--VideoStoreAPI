"use strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');

db.serialize(function seedData() {
  db.parallelize(function() {
    db.serialize(function seedMovies() {
      var statement = db.prepare(
        'INSERT INTO movies (title, overview, release_date, inventory) \
        VALUES (?, ?, ?, ?);'
      );
      var movies = require('./seed_data/movies.json');

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
    });

    db.serialize(function seedCustomers() {
      var statement = db.prepare(
        'INSERT INTO customers (name, registered_at, address, city, state, postal_code, phone, account_balance) \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);'
      );
      var customers = require('./seed_data/customers.json');

      for (var i = 0; i < customers.length; i++) {
        var customer = customers[i];

        var date = new Date(customer.registered_at);
        var date = date.getFullYear() + '-' + to2Digits(date.getMonth() + 1) + '-' + to2Digits(date.getDate());

        statement.run(
          customer.name,
          date,
          customer.address,
          customer.city,
          customer.state,
          customer.postal_code,
          customer.phone,
          parseInt(customer.account_credit * 100)
        );
      }

      statement.finalize();
    });
  });

  db.serialize(function seedRentals() {
    var statement = db.prepare(
      'INSERT INTO rentals (checkout_date, return_date, movie_title, customer_id) \
      VALUES (?, ?, ?, ?);'
    );

    var rentals = require('./seed_data/rentals.json');

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
  });

  // db.serialize(function seedRentals() {
  //   var numRentals = 10;
  //   db.all('SELECT * FROM movies LIMIT ' + numRentals + ';', createRentals);
  // });
});

// // TODO: come back to this! It would be nice to import the dates. Until then, we'll use the other one.
// function createRentals(err, movies) {
//   if (err) { console.log('You suck :P'); return; }

//   var db = new sqlite3.Database('db/' + db_env + '.db');

//   db.serialize(function() {
//     var statement = db.prepare(
//       'INSERT INTO rentals (movie_title, customer_id) \
//       VALUES (?, ?);'
//     );

//     for (var i = 0; i < movies.length; i++) {
//       var movie = movies[i];
//       statement.run(movie.title, i);
//     }

//     statement.finalize();

//     db.close();
//   });
// }

db.close();

function to2Digits(num) {
  num = num < 10 ? '0' + num : num;
  return num;
}
