"use strict";

var assert = require("assert");
var sqlite3 = require('sqlite3').verbose();
var Customer = require('../../models/customer');

describe('Customer', function() {
  var customer;
  var dbPath = "db/test.db";
  var numSeeded = 2;
  var validCustomerData = function validCustomerData() {
    return {
      name: 'Customer1',
      registered_at: 'Yesterday',
      address: '1234 Nowhere St',
      city: 'Nowhereville',
      state: 'NW',
      postal_code: '12345',
      phone: '123-456-7890',
      account_balance: '2045'
    };
  };

  beforeEach(function(done) {
    customer = new Customer();
    resetCustomersTable(done);
  });

  it('can be instantiated', function() {
    assert.equal(customer instanceof Customer, true);
  });

  it('holds onto the `path` to the database', function() {
    assert.equal(customer.dbPath(), dbPath);
  });

  describe('#create', function() {
    it('creates a new customer record', function(done) {
      var data = validCustomerData();

     customer.create(data, function(err, res) {
       assert.equal(err, undefined);
       assert.equal(res.insertedID, numSeeded + 1);
       assert.equal(res.changed, 1);
       done();
     });
    });

    it('requires at least one input', function(done) {
      var data = {}

      customer.create(data, function(err, res) {
        // err = { [Error: SQLITE_ERROR: near ")": syntax error] errno: 1, code: 'SQLITE_ERROR' }
        assert.equal(err.errno, 1);
        done();
      });
    });

    it('requires a name', function(done) {
      var data = validCustomerData();
      delete data.name;

      customer.create(data, function(err, res) {
        // err = { [Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: customers.name] errno: 19, code: 'SQLITE_CONSTRAINT' }
        assert.equal(err.errno, 19);
        assert.equal(err.message, 'SQLITE_CONSTRAINT: NOT NULL constraint failed: customers.name');
        done();
      });
    });

    it('defaults account balance to zero', function(done) {
      var data = validCustomerData();
      delete data.account_balance;

      customer.create(data, function(err, res) {
        assert.equal(err, undefined);
        assert(res.insertedID, numSeeded + 1);
        customer.findBy('id', res.insertedID, function(err, rows) {
          assert.equal(rows.length, 1);
          assert.equal(rows[0].account_balance, 0);
          done();
        });
      });
    });
  });

  describe('#all', function() {
    it('returns all customers', function(done) {
      customer.all(function(err, rows){
        assert.equal(err, undefined);
        assert.equal(rows.length, numSeeded);
        done();
      });
    });
  });

  describe('#findBy', function() {
    // because of how we seeded the db, this also tests that it will only return exact title matches
    it('returns 1 customer where the name is Customer1', function(done) {
      customer.findBy('name', 'Customer1', function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].name, 'Customer1');
        done();
      });
    });

    it('"CUSTOMER1" returns customer with name "Customer1"', function(done) {
      customer.findBy('name', 'CUSTOMER1', function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].name, 'Customer1');
        done();
      });
    });

    it('does not return partial patches', function(done) {
      customer.findBy('name', 'Customer', function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 0);
        done();
      });
    });

    it('returns an error when an unrecognized column is provided', function(done) {
      customer.findBy('badColumnName', 'Jaws', function(err, rows) {
        assert(err);
        assert.equal(err.message, 'Error: syntax error. Unrecognized parameter.');
        assert.equal(rows, undefined);
        done();
      });
    });
  });

  describe('#sortBy', function() {
    // sort options: name, registered_at, postal_code
    it('returns all customers sorted by name', function(done) {
      customer.sortBy('name', 'all', function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, numSeeded);
        assert.equal(rows[0].name, 'Customer1');
        done();
      });
    });

    it('returns all customers sorted by postal_code', function(done) {
      customer.sortBy('postal_code', 'all', function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, numSeeded);
        assert.equal(rows[0].postal_code, 'Zip1');
        done();
      });
    });

    it('returns 1 customer sorted by registered_at', function(done) {
      customer.sortBy('registered_at', 1, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].registered_at, '01/02/2015');
        done();
      });
    });
  });

  describe('#rentals', function() {
    before(function(done) {
      seedRentals(done);
    });

    it('returns all rentals for a given customer, in order by checkout date', function(done) {
      customer.rentals(1, function(err, rows) {
        assert.equal(rows.length, 2);
        assert.equal(rows[0].movie_title, "Movie2");
        assert.equal(rows[1].movie_title, "Movie1");
        done();
      });
    });
  });

  // describe('#movies', function() {
  //   before(function(done) {
  //     seedRentals(done);
  //   });

  //   it('returns all movies the customer has/had checked out', function(done) {
  //     customer.movies(1, function(err, rows) {
  //       assert.equal(rows.length, 2);
  //       assert.equal(rows[0].title, "Movie1");
  //       assert.equal(rows[1].title, "Movie2");
  //       done();
  //     });
  //   });
  // });
});


// TODO: CLEAN THIS UP!
// THIS. IS. AWFUL.
function resetCustomersTable(done) {
  var db = new sqlite3.Database('db/test.db');
  db.serialize(function() {
    db.exec(
      "BEGIN; \
      DELETE FROM customers; \
      INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_balance) \
      VALUES('Customer1', '01/02/2015', 'Address1', 'City1', 'State1', 'Zip1', 'Phone1', '1250'), \
            ('Customer2', '12/01/2014', 'Address2', 'City2', 'State2', 'Zip2', 'Phone2', '1000'); \
      COMMIT;",
      function(err) {
        db.close();
        done();
      }
    );
  });
}

function seedRentals(done) {
  var db = new sqlite3.Database('db/test.db');
  // reset movies
  db.serialize(function() {
    db.exec(
      "BEGIN; \
      DELETE FROM movies; \
      INSERT INTO movies(title, overview, release_date, inventory) \
      VALUES('Movie1', 'Descr1', '1975-06-19', 10), \
            ('Movie2', 'Descr2', 'Yesterday', 11), \
            ('Movie3', 'Descr3', 'Yesterday', 11); \
      COMMIT;",
      function(err) {
        db.close();
        resetRentalsTable(done); // reset rentals
      }
    );
  });
}

function resetRentalsTable(done) {
  var db = new sqlite3.Database('db/test.db');
  db.serialize(function() {
    db.exec(
      "BEGIN; \
      DELETE FROM rentals; \
      INSERT INTO rentals(checkout_date, return_date, movie_title, customer_id) \
      VALUES('2015-09-16', '', 'Movie1', 1), \
            ('2015-03-16', '2015-03-20', 'Movie2', 1), \
            ('2015-09-18', '', 'Movie3', 2); \
      COMMIT;",
      function(err) {
        db.close();
        done();
      }
    );
  });
}
