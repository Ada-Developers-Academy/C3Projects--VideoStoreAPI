"use strict";

var sqlite3 = require("sqlite3").verbose(),
  db_env = process.env.DB || 'development',
  db = new sqlite3.Database('db/' + db_env + '.db');

// MOVIES TABLE =========================================================================
var movies = require('./movies');
var movie_statement = db.prepare(
  "INSERT INTO movies(title, overview, inventory, release_date, available) VALUES (?, ?, ?, ?, ?);"
);

db.serialize(function(){
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
})

// CUSTOMERS TABLE =========================================================================
var customers = require('./customers');
var customer_statement = db.prepare(
  "INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) VALUES (?, ?, ?, ?, ?, ?, ?, ?);"
);

db.serialize(function(){
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
})


db.close();
