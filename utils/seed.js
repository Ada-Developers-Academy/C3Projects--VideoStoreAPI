"use strict";

module.exports = function(callback) {
  var sqlite3 = require("sqlite3").verbose(),
      db_env  = process.env.DB || 'development',
      db      = new sqlite3.Database('db/' + db_env + '.db');

  // MOVIES TABLE =========================================================================
  var movies = require('./movies-' + db_env + '.json');

  // CUSTOMERS TABLE =========================================================================
  var customers = require('./customers-' + db_env + '.json');

  // RENTAL TABLE ===============================================================================
  var rentals = require('./rentals-' + db_env + '.json');

  db.serialize(function() {
    db.exec("BEGIN IMMEDIATE");
    var rental_statement = db.prepare(
      "INSERT INTO rentals(checkout_date, returned_date, rental_time, cost, total, customer_id, movie_id) VALUES (?, ?, ?, ?, ?, ?, ?);"
      );
    for(var i = 0; i < rentals.length; i++) {
      var rental = rentals[i];
      rental_statement.run(
        rental.checkout_date,
        rental.returned_date,
        rental.rental_time,
        rental.cost,
        rental.total,
        rental.customer_id,
        rental.movie_id
      );
    }
    rental_statement.finalize();

    var movie_statement = db.prepare(
      "INSERT INTO movies(title, overview, inventory, release_date, available) VALUES (?, ?, ?, ?, ?);"
    );
    for(var i= 0; i < movies.length; i ++) {
      var movie = movies[i];
      movie_statement.run(
        movie.title,
        movie.overview,
        movie.inventory,
        movie.release_date,
        movie.inventory
      );
    }
    movie_statement.finalize();

    var customer_statement = db.prepare(
      "INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) VALUES (?, ?, ?, ?, ?, ?, ?, ?);"
    );

    for(var i= 0; i < customers.length; i ++) {
      var customer = customers[i];
      customer_statement.run(
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
    customer_statement.finalize();

    db.exec("COMMIT", function(error) {
      console.log("I'm done setting up the db")
      callback(error, "Success");
      db.close();
    });
  })
}
