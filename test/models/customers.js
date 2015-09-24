"use strict";

var assert   = require('assert'),
    sqlite3  = require('sqlite3').verbose(),
    customer = require('../../models/customers');

describe("Customer Model", function() {
  var a_customer;
  var db_cleaner;

  beforeEach(function(done) {
    a_customer = new customer();
    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.parallelize(function() {
        db_cleaner.exec(
          "BEGIN TRANSACTION; \
          DELETE FROM rentals; \
          INSERT INTO rentals(check_out_date, check_in_date, expected_return_date, customer_id, movie_id) \
          VALUES('2015-01-01', '2015-01-10', '2015-02-01', 1, 1), \
                ('2015-01-01', null, '2015-02-01', 1, 2); \
          COMMIT TRANSACTION;"
        ); // rentals

        db_cleaner.exec(
          "BEGIN TRANSACTION; \
          DELETE FROM movies; \
          INSERT INTO movies(title, overview, release_date, inventory) \
          VALUES('The Movie', 'See title.', '2000-01-01', 10), \
                ('The Movie: Sequal', 'So amazing.', '2001-01-01', 5); \
          COMMIT TRANSACTION;"
        ); // movies

        db_cleaner.exec(
          "BEGIN TRANSACTION; \
          DELETE FROM customers; \
          INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
          VALUES('B', '2015-01-01', '111 St', 'Seattle', 'WA', '55555', '555-5555', 19.50), \
                ('A', '2015-01-02', '222 St', 'Seattle', 'WA', '11111', '666-6666', 18.50), \
                ('C', '2014-01-01', '333 St', 'Seattle', 'WA', '99999', '444-4444', 21.00); \
          COMMIT TRANSACTION;"
        ); // customers
      })

      db_cleaner.close(function() {
        done();
      });
    });
  })

  it("can be instantiated", function(done) {
    assert(a_customer instanceof customer);
    done();
  });

  describe("instance methods: all", function() {
    it("can find all customers", function(done) {
      a_customer.all(function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 3);

        assert.equal(res[0].name, 'B');
        assert.equal(res[1].name, 'A');
        assert.equal(res[2].name, 'C');

        done();
      });
    });
  });

  describe("instance methods: find_current", function() {
    it("finds the checked out movies for the customer", function(done) {
      a_customer.find_current(1, function(err, res) {
        var keys = ['movie_id', 'title', "check_out_date", "expected_return_date"];
        assert.equal(err, undefined);
        assert(res instanceof Object);

        assert.deepEqual(Object.keys(res[0]), keys);

        assert.equal(res.length, 1);
        assert.equal(res[0].movie_id, 2);

        done();
      });
    });
  });
})
