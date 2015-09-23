var assert   = require('assert'),
    Customer = require('../../models/customer'),
    sqlite3  = require('sqlite3').verbose();

describe("Customer", function() {
  var customer, db_cleaner;

  beforeEach(function(done) {
    customer = new Customer();

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
    assert(customer instanceof Customer);
  });

  describe("instance methods", function() {
    context("GET #find_all", function() {
      it("retrieves all customer records", function(done) {
        customer.find_all(function(err, res) {
          assert.equal(err, undefined);
          assert(res instanceof Array);
          assert.equal(res.length, 3);
          assert.equal(res[0].name, 'Beetle Juice');
          done();
        });
      });
    });

    context("GET #by_column", function() {
      it("successfully retrieves an Array object", function (done) {
        customer.by_column("name", 3, 0, function(err, res) {
          assert.equal(err, undefined);
          assert(res instanceof Array);
          done();
        });
      });

      it("retrieves records sorted by name column", function(done) {
        customer.by_column("name", 3, 0, function(err, res) {
          assert.equal(res.length, 3);
          assert.equal(res[0].name, 'Aaron Aaronson');
          assert.equal(res[1].name, 'Beetle Juice');
          done();
        });
      });

      it("retrieves records sorted by registered_at column", function(done) {
        customer.by_column("registered_at", 3, 0, function(err, res) {
          assert.equal(res.length, 3);
          assert.equal(res[0].name, 'Juicy Beetle');
          assert.equal(res[1].name, 'Beetle Juice');
          done();
        });
      });

      it("retrieves records sorted by postal_code column", function(done) {
        customer.by_column("postal_code", 3, 0, function(err, res) {
          assert.equal(res.length, 3);
          assert.equal(res[0].name, 'Beetle Juice');
          assert.equal(res[1].name, 'Aaron Aaronson');
          done();
        });
      });

      it("retrieves correct number of records", function(done) {
        customer.by_column("name", 2, 0, function(err, res) {
          assert.equal(res.length, 2);
          done();
        });
      });

      it("retrieves records offset by correct number of records", function(done) {
        customer.by_column("name", 2, 1, function(err, res) {
          assert.equal(res.length, 2);
          assert.equal(res[0].name, 'Beetle Juice');
          done();
        });
      });
    });

    context("GET #movies_by_customer_current", function() {
      it("retrieves customer's currently checked out movies", function(done) {
        customer.movies_by_customer_current(2, function(err, res) {
          assert.equal(err, undefined);
          assert(res instanceof Array);
          assert.equal(res.length, 3);
          assert.equal(res[0].title, 'Jaws');
          done();
        });
      });
    });

    context("GET #movies_by_customer_history", function() {
      it("retrieves customer's previously checked out movies", function(done) {
        customer.movies_by_customer_history(1, function(err, res) {
          assert.equal(err, undefined);
          assert(res instanceof Array);
          assert.equal(res.length, 1);
          assert.equal(res[0].title, 'Jaws');
          done();
        });
      });
    });

    context("GET #customers_overdue", function() {
      it("retrieves list of customers with overdue movies", function(done) {
        customer.customers_overdue(function(err, res) {
          assert.equal(err, undefined);
          assert(res instanceof Array);
          assert.equal(res.length, 2);
          done();
        });
      });

      it("customers list is sorted by return_date", function(done) {
        customer.customers_overdue(function(err, res) {
          assert.equal(res[0].name, 'Juicy Beetle');
          done();
        });
      });

    });

  });
});
