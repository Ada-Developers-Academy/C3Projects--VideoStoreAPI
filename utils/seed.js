"use strict";

var sqlite3 = require('sqlite3').verbose(),
  db_env = process.env.DB || 'development',
  db = new sqlite3.Database('db/' + db_env + '.db');

  var movies =  require('./movies');
  var movie_statement = db.prepare(
    "INSERT INTO movies(title, overview, release_date, inventory) \
    VALUES (?, ?, ?, ?);"
  );

  var customers = require('./customers');
  var customers_statement = db.prepare(
    "INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);"
  );

  var rentals = require('./rentals');
  var rentals_statement = db.prepare(
    "INSERT INTO rentals(checkout_date, due_date, return_date, overdue, movie_id, customer_id) \
    VALUES (?, ?, ?, ?, ?, ?);"
  );

  //loop through movies
  db.serialize(function() {
    for(var i = 0; i < movies.length; i++) {
      var movie = movies[i];
      movie_statement.run(
        movie.title,
        movie.overview,
        movie.release_date,
        movie.inventory
      );
    }
    movie_statement.finalize();

    for(var j = 0; j < rentals.length; j++) {
      var rental = rentals[j];
      rentals_statement.run(
        rental.checkout_date,
        rental.due_date,
        rental.return_date,
        rental.overdue,
        rental.movie_id,
        rental.customer_id
      );
    }
    rentals_statement.finalize();

    for(var k = 0; k < customers.length; k++) {
      var customer = customers[k];
      customers_statement.run(
        customer.name,
        customer.registered_at,
        customer.address,
        customer.city,
        customer.state,
        customer.postal_code,
        customer.phone,
        customer.account_credit
      );
    }
    customers_statement.finalize();
  })


db.close();
