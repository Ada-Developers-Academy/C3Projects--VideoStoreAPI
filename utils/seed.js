"use-strict";

var sqlite3 = require('sqlite3').verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');

var movies = require('./movies'); // requires in movies.json file
var movie_statement = db.prepare( // we will use this statement later
  "INSERT INTO MOVIES(title, overview, release_date, inventory, inventory_available) \
  VALUES( ?, ?, ?, ?, ?);"
);

var customers = require('./customers'); // requires in movies.json file
var customer_statement = db.prepare( // we will use this statement later
  "INSERT INTO CUSTOMERS(name, registered_at, address, city, state, postal_code, phone, account_credit) \
  VALUES( ?, ?, ?, ?, ?, ?, ?, ?);"
);

var rentals = require('./rentals'); // requires in movies.json file
var rental_statement = db.prepare( // we will use this statement later
  "INSERT INTO RENTALS(check_out, check_in, due_date, overdue, customer_id, movie_id) \
  VALUES( ?, ?, ?, ?, ?, ?);"
);

db.serialize(function() {
  // loop through movies
  for(var i = 0; i < movies.length; i++) {
    var movie = movies[i];

    // insert each movie into the db
    movie_statement.run(
      movie.title,
      movie.overview,
      movie.release_date,
      movie.inventory,
      movie.inventory // this seeds our inventory_available to be equal to our total inventory
    );
  }

  // loop through customers
  for(var j = 0; j < customers.length; j++) {
    var customer = customers[j];
    // this will format dates in sqlite to read year/month/day for easier sorting
    var dateObj = new Date(customer.registered_at);
    var month = (dateObj.getUTCMonth() + 1).toString(); //months from 1-12
    var day = (dateObj.getUTCDate()).toString();
    var year = (dateObj.getUTCFullYear()).toString();

    if (month.length == 1) { // This will ensure month is two digits
      month = "0" + month;
    }

    if (day.length == 1) { // This will ensure day is two digits
      day = "0" + day;
    }

    var formatted_date = parseInt(year + month + day);

    // insert each customer into the db
    customer_statement.run(
      customer.name,
      formatted_date,
      customer.address,
      customer.city,
      customer.state,
      customer.postal_code,
      customer.phone,
      customer.account_credit
    );
  }

  // loop through rentals
  for(var j = 0; j < rentals.length; j++) {
    var rental = rentals[j];

    // insert each rental into the db
    rental_statement.run(
      rental.check_out,
      rental.check_in,
      rental.due_date,
      rental.overdue,
      rental.customer_id,
      rental.movie_id
    );
  }

  movie_statement.finalize();
  customer_statement.finalize();
  rental_statement.finalize();
})

db.close();
