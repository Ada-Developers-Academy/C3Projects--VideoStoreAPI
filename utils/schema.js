"use strict";

module.exports = function(callback) {
  var sqlite3 = require("sqlite3").verbose(),
    db_env = process.env.DB || 'development',
    db = new sqlite3.Database('db/' + db_env + '.db');

  var movie_fields = [
    ['title', 'text'],
    ['overview', 'text'],
    ['release_date', 'text'],
    ['inventory', 'integer'],
    ['available', 'integer']
  ];

  var customer_fields = [
    ['name', 'text'],
    ['registered_at', 'text'],
    ['address', 'text'],
    ['city', 'text'],
    ['state', 'text'],
    ['postal_code', 'text'],
    ['phone', 'text'],
    ['account_credit', 'integer']
  ];

  var rental_fields = [
    ['checkout_date', 'text'],
    ['returned_date', 'text'],
    ['rental_time', 'integer'],
    ['cost', 'integer'],
    ['total', 'integer'],
    ['customer_id', 'integer', 'fk_CustomerRentals FOREIGN KEY(customer_id) REFERENCES customers(id)'],
    ['movie_id', 'integer', 'fk_MovieRentals FOREIGN KEY(movie_id) REFERENCES movies(id)']
    // ["FOREIGN KEY(customer_id)", "REFERENCES customers(id)"],
    // ["FOREIGN KEY(movie_id)", "REFERENCES movies(id)"]
  ];

  db.serialize(function() {
    db.exec("BEGIN");

    db.exec("DROP TABLE IF EXISTS customers;");

    db.exec("CREATE TABLE customers (id INTEGER PRIMARY KEY);");

    for(var i = 0; i < customer_fields.length; i++){
      var name = customer_fields[i][0],
          type = customer_fields[i][1];
      db.exec("ALTER TABLE customers ADD COLUMN " + name + " " + type + ";");
    }

    db.exec("DROP TABLE IF EXISTS movies;");

    db.exec("CREATE TABLE movies (id INTEGER PRIMARY KEY);");

    for(var i = 0; i < movie_fields.length; i++){
      var name = movie_fields[i][0],
          type = movie_fields[i][1];
      db.exec("ALTER TABLE movies ADD COLUMN " + name + " " + type + ";", function(error, result){
      });
    }

    db.exec("DROP TABLE IF EXISTS rentals;");

    db.exec("CREATE TABLE rentals (id INTEGER PRIMARY KEY);");

    for(var i = 0; i < rental_fields.length; i++){
      var name = rental_fields[i][0],
          type = rental_fields[i][1];
          if(rental_fields[i][2] == void 0){
            var foreign_key = rental_fields[i][2];
          }

      db.exec("ALTER TABLE rentals ADD COLUMN " + name + " " + type + ";");
      if(foreign_key) {
      db.exec("ALTER TABLE rentals ADD CONSTRAINT " + foreign_key + ";");
      }
    }
    db.exec("COMMIT", function(error) {
      db.close();
      callback(error, "Success");
      console.log("I'm done setting up the db")
    });
  });

  // db.close();
  // callback()
}
