"use strict";

var assert = require("assert");
var sqlite3 = require('sqlite3').verbose();
var Customer = require('../../models/customer');
var resetTables = require('../dbCleaner');

describe('Customer', function() {
  var customer = new Customer();

  it('can be instantiated', function() {
    assert.equal(customer instanceof Customer, true);
  });

  it('holds onto the `path` to the database', function() {
    assert.equal(customer.dbPath(), "db/test.db");
  });

  describe('#create', function() {
    function validCustomerData() {
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
      resetTables({}, done)
    });

    it('creates a new customer record', function(done) {
      var data = validCustomerData();

     customer.create(data, function(err, res) {
       assert.equal(err, undefined);
       assert.equal(res.insertedID, 1);
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
        assert(res.insertedID, 1);
        customer.findBy('id', 1, function(err, rows) {
          assert.equal(rows.length, 1);
          assert.equal(rows[0].account_balance, 0);
          done();
        });
      });
    });
  });

  describe('#all', function() {
    var numCustomersSeeded;

    beforeEach(function(done) {
      var data = {
        customers: [
          { name: 'Customer1', registered_at: '2015-01-02', address: 'Address1', city: 'City1', state: 'State1', postal_code: 'Zip1', phone: 'Phone1', account_balance: '1250' },
          { name: 'Customer2', registered_at: '2014-12-01', address: 'Address2', city: 'City2', state: 'State2', postal_code: 'Zip2', phone: 'Phone2', account_balance: '1000' },
          { name: 'Customer3', registered_at: '2014-01-25', address: 'Address3', city: 'City3', state: 'State3', postal_code: 'Zip3', phone: 'Phone3', account_balance: '3000' }
        ]
      }

      numCustomersSeeded = data.customers.length;

      resetTables(data, done);
    });

    it('returns all customers', function(done) {
      customer.all(function(err, rows){
        assert.equal(err, undefined);
        assert.equal(rows.length, numCustomersSeeded);
        done();
      });
    });
  });

  describe('#findBy', function() {
    var numCustomersSeeded;

    beforeEach(function(done) {
      var data = {
        customers: [
          { name: 'Customer1', registered_at: '2015-01-02', address: 'Address1', city: 'City1', state: 'State1', postal_code: 'Zip1', phone: 'Phone1', account_balance: '1250' },
          { name: 'Customer2', registered_at: '2014-12-01', address: 'Address2', city: 'City2', state: 'State2', postal_code: 'Zip2', phone: 'Phone2', account_balance: '1000' },
          { name: 'Customer3', registered_at: '2014-01-25', address: 'Address3', city: 'City3', state: 'State3', postal_code: 'Zip3', phone: 'Phone3', account_balance: '3000' }
        ]
      }

      numCustomersSeeded = data.customers.length;

      resetTables(data, done);
    });

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
    var numCustomersSeeded;

    beforeEach(function(done) {
      var data = {
        customers: [
          // intentionally out of order in order to test sorting
          { name: 'Customer2', registered_at: '2014-12-01', address: 'Address2', city: 'City2', state: 'State2', postal_code: 'Zip2', phone: 'Phone2', account_balance: '1000' },
          { name: 'Customer3', registered_at: '2014-01-25', address: 'Address3', city: 'City3', state: 'State3', postal_code: 'Zip3', phone: 'Phone3', account_balance: '3000' },
          { name: 'Customer1', registered_at: '2015-01-02', address: 'Address1', city: 'City1', state: 'State1', postal_code: 'Zip1', phone: 'Phone1', account_balance: '1250' }
        ]
      }

      numCustomersSeeded = data.customers.length;

      resetTables(data, done);
    });

    it('returns all customers sorted by name', function(done) {
      customer.sortBy('name', null, null, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, numCustomersSeeded);
        assert.equal(rows[0].name, 'Customer1');
        done();
      });
    });

    it('returns 1 customer sorted by postal_code', function(done) {
      customer.sortBy('postal_code', 1, null, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].postal_code, 'Zip1');
        done();
      });
    });

    it('returns all customers sorted by registered_at', function(done) {
      customer.sortBy('registered_at', null, null, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, numCustomersSeeded);
        assert.equal(rows[0].registered_at, '2014-01-25');
        done();
      });
    });

    it('returns 1 customer sorted by name from the second page', function(done) {
      customer.sortBy('name', 1, 2, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].name, 'Customer2');
        done();
      });
    });

    it('returns an error when an unrecognized column is provided', function(done) {
      customer.sortBy('badColumnName', null, null, function(err, rows) {
        assert(err);
        assert.equal(err.message, 'Bad request');
        assert.equal(rows, undefined);
        done();
      });
    });
  });

  describe('#rentals', function() {
    before(function(done) {
      var data = {
        customers: [
          { name: 'Customer1', registered_at: '2015-01-02', address: 'Address1', city: 'City1', state: 'State1', postal_code: 'Zip1', phone: 'Phone1', account_balance: '1250' },
          { name: 'Customer2', registered_at: '2014-12-01', address: 'Address2', city: 'City2', state: 'State2', postal_code: 'Zip2', phone: 'Phone2', account_balance: '1000' },
          { name: 'Customer3', registered_at: '2014-01-25', address: 'Address3', city: 'City3', state: 'State3', postal_code: 'Zip3', phone: 'Phone3', account_balance: '3000' }
        ],
        movies: [
          { title: 'Movie1', overview: 'Descr1', release_date: '1975-06-19', inventory: 10 },
          { title: 'Movie2', overview: 'Descr2', release_date: '2005-05-12', inventory: 11 },
          { title: 'Movie3', overview: 'Descr3', release_date: '2012-10-16', inventory: 11 },
          { title: 'Movie4', overview: 'Descr4', release_date: '1985-03-22', inventory: 7 }
        ],
        rentals: [
          { checkout_date: '2015-09-16', return_date: '', movie_title: 'Movie1', customer_id: 1 },
          { checkout_date: '2015-03-16', return_date: '2015-03-20', movie_title: 'Movie2', customer_id: 1 },
          { checkout_date: '2015-09-18', return_date: '', movie_title: 'Movie3', customer_id: 2 },
          { checkout_date: '2015-02-23', return_date: '', movie_title: 'Movie4', customer_id: 2 }
        ]
      }

      resetTables(data, done);
    });

    it('returns all rentals for a given customer, in order by checkout date', function(done) {
      customer.rentals(1, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 2);
        assert.equal(rows[0].movie_title, "Movie2");
        assert.equal(rows[1].movie_title, "Movie1");
        done();
      });
    });
  });

  describe('#overdue', function() {
    it('returns a list of customers with overdue movies', function(done) {
      customer.overdue(function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 2); // this will change to 3 on 2015-09-26 as our seed data becomes overdue
        assert.equal(rows[0].name, 'Customer1');
        assert.equal(rows[0].movie_title, 'Movie1');
        assert.equal(rows[0].checkout_date, '2015-09-16');
        done();
      });
    });
  });

  // describe('#movies', function() {
    // before(function(done) {
    //   seedRentals(done); // this has been deprecated
    // });

    // it('returns all movies the customer has/had checked out', function(done) {
    //   customer.movies(1, function(err, rows) {
    //     assert.equal(rows.length, 2);
    //     assert.equal(rows[0].title, "Movie1");
    //     assert.equal(rows[1].title, "Movie2");
    //     done();
    //   });
    // });
  // });
});
