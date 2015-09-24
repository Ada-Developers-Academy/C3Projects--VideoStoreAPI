var assert = require('assert'),
    Rental  = require('../../models/rental'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose();

describe("Rental", function() {
  var rental, db_cleaner;

  beforeEach(function(done) {
    rental = new Rental();

    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM customers; \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('Beetle Juice', '2015-01-01', '123 street', 'Burlington', 'WA', '98101', '3604216650', 5.25), \
              ('Juicy Beetle', '2014-01-01', '123 street', 'Burlington', 'WA', '98211', '3604216650', 5.55), \
              ('Aaron Aaronson', '2015-02-01', '123 street', 'Burlington', 'WA', '98195', '3604216650', 5.55); \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory, num_available) \
        VALUES('Jaws', 'Shark!', 'Yesterday', 10, 8), \
              ('Maws', 'Worm!', 'Yesterday', 11, 8); \
        DELETE FROM rentals; \
        INSERT INTO rentals(checkout_date, return_date, movie_id, customer_id, checked_out) \
        VALUES('2015-02-14', '2015-02-21', '1', '1', 'false'), \
              ('2015-09-22', '2015-09-29', '1', '2', 'true'), \
              ('2015-09-22', '2015-09-29', '2', '2', 'true'), \
              ('2015-09-14', '2015-09-20', '1', '1', 'true'), \
              ('2015-07-22', '2015-09-01', '1', '2', 'true'); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  it("can be instantiated", function() {
    assert(rental instanceof Rental);
  });

  describe("instance methods", function() {
    context("GET #check_out", function() {

      it("is successful", function(done) {
        rental.check_out(1, "Jaws", function(err, res) {
          assert.equal(err, undefined);
          done();
        });
      });

      it("returns a json object with expected keys", function(done) {
        rental.check_out(1, "Jaws", function(err, res) {
          // assert(res instanceof Array); // returns a json response...
          assert.equal(res.inserted_id, 6);
          assert.equal(res.changed, 1);
          done();
        });
      });
    });



  });
});
