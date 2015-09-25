var assert = require('assert'),
    Database = require('../../database'),
    Movie = require('../../movies'),
    Customer = require('../../customers'),
    Rental = require('../../rentals'),
    sqlite3 = require('sqlite3').verbose();

describe("Database", function() {
  var movie, customer, rental, db_cleaner;

  beforeEach(function(done) {
    movie = new Movie();
    customer = new Customer();
    rental = new Rental();


    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM rentals; DELETE FROM customers; DELETE FROM movies; \
        INSERT INTO rentals(check_out, check_in, due_date, overdue, movie_title, customer_id) \
        VALUES(20150616, 20150617, 20150619, 0, 'Jaws', 1), \
              (20150616, null, 20150619, 1, 'Alien', 1); \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('Harry', 20150616, '1234', 'Seattle', 'WA', '98103', '1234567', 123); \
        INSERT INTO movies(title, overview, release_date, inventory, inventory_available) \
        VALUES('Jaws', 'something', 19750619, 6, 6), \
        ('Alien', 'something else', 19790525, 4, 4); \
        COMMIT;", function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  describe("models that inherit from database", function() {
    it("Movie can be instantiated", function(done) {
      assert(movie instanceof Movie);
      done();
    });

    it("Customer can be instantiated", function(done) {
      assert(customer instanceof Customer);
      done();
    });

    it("Rental can be instantiated", function(done) {
      assert(rental instanceof Rental);
      done();
    });
  });

  // describe("formatDate", function() {
  //   it("returns date as an integer in the form of YYYYMMDD", function(done) {
  //     Database.formatDate();
  //   });
  // });

});
