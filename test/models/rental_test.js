"use strict";

var assert = require("assert");
var Rental = require('../../models/rental');
var Customer = require('../../models/customer');
var resetTables = require('../dbCleaner');

describe('Rental', function() {
  var rental = new Rental();

  it("can be instantiated", function() {
    assert(rental instanceof Rental);
  });

  it("holds onto the `path` to the database", function() {
    assert.equal(rental.dbPath(), "db/test.db");
  });

  describe('#create', function() {
    function validRentalData() {
      return {
        checkout_date: '2014-12-16',
        return_date: '',
        movie_title: 'The Great Escape',
        customer_id: 15
      };
    };

    beforeEach(function(done) {
      resetTables({}, done);
    });

    it('creates a new rental record', function(done) {
      var data = validRentalData();

      rental.create(data, function(err, res) {
        assert.equal(err, undefined);
        assert.equal(res.insertedID, 1);
        assert.equal(res.changed, 1);
        done();
      });
    });

    it('defaults checkout_date to current date', function(done) {
      var data = validRentalData();
      var date = new Date(),
          year = date.getFullYear(),
          month = addZero(date.getMonth() + 1),
          day = addZero(date.getDate());

      function addZero(unit) {
        unit = unit < 10 ? "0" + unit : unit;
        return unit;
      }

      var current_date = year + "-" + month + "-" + day;
      delete data.checkout_date;

      rental.create(data, function(err, res) {
        assert.equal(err, undefined);
        assert(res.insertedID, 1);

        rental.findBy('movie_title', data.movie_title, function(err, rows) {
          assert.equal(rows.length, 1);
          assert.equal(rows[0].checkout_date, current_date);
          done();
        });
      });
    });

    it('requires a movie_title', function(done) {
      var data = validRentalData();
      delete data.movie_title;

      rental.create(data, function(err, res) {
        assert.equal(err.errno, 19);
        assert.equal(err.message, 'SQLITE_CONSTRAINT: NOT NULL constraint failed: rentals.movie_title');
        done();
      });
    });

    it('requires a customer_id', function(done) {
      var data = validRentalData();
      delete data.customer_id;

      rental.create(data, function(err, res) {
        assert.equal(err.errno, 19);
        assert.equal(err.message, 'SQLITE_CONSTRAINT: NOT NULL constraint failed: rentals.customer_id');
        done();
      });
    });
  });

  describe('#all', function() {
    var numRentalsSeeded;

    beforeEach(function(done) {
      var data = {
        rentals: [
          { checkout_date: '2015-03-16', return_date: '2015-03-20', movie_title: 'North by Northwest', customer_id: 2 },
          { checkout_date: '2015-09-16', return_date: '', movie_title: 'Wait Until Dark', customer_id: 9 },
          { checkout_date: '2015-08-10', return_date: '', movie_title: 'Jaws', customer_id: 1 }
        ]
      }

      numRentalsSeeded = data.rentals.length;

      resetTables(data, done);
    });

    it('returns all rentals', function(done) {
      rental.all(function(err, rows){
        assert.equal(err, undefined);
        assert.equal(rows.length, numRentalsSeeded);
        done();
      });
    });
  });

  describe('#findBy', function() {
    beforeEach(function(done) {
      var data = {
        rentals: [
          { checkout_date: '2015-03-16', return_date: '2015-03-20', movie_title: 'North by Northwest', customer_id: 2 },
          { checkout_date: '2015-09-16', return_date: '', movie_title: 'Wait Until Dark', customer_id: 9 },
          { checkout_date: '2015-08-10', return_date: '', movie_title: 'Jaws', customer_id: 1 }
        ]
      }

      resetTables(data, done);
    });

    it("returns 1 rental where the movie_title is 'Wait Until Dark'", function(done) {
      rental.findBy('movie_title', 'Wait Until Dark', function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].movie_title, 'Wait Until Dark');
        done();
      });
    });

    it("'WAIT UNTIL dark' returns 1 rental where the movie_title is 'Wait Until Dark'", function(done) {
      rental.findBy('movie_title', 'WAIT UNTIL dark', function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].movie_title, 'Wait Until Dark');
        done();
      });
    });

    it('returns all rentals where the return_date is an empty string', function(done) {
      rental.findBy('return_date', "", function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 2);
        assert.equal(rows[0].movie_title, 'Wait Until Dark');
        assert.equal(rows[1].movie_title, 'Jaws');
        done();
      });
    });

    it('returns an error when an unrecognized column is provided', function(done) {
      rental.findBy('badColumnName', 'North by Northwest', function(err, rows) {
        assert(err);
        assert.equal(err.message, 'Error: syntax error. Unrecognized parameter.');
        assert.equal(rows, undefined);
        done();
      });
    });
  });

  describe('#sortBy', function() {
    var numRentalsSeeded;

    beforeEach(function(done) {
      var data = {
        rentals: [
          { checkout_date: '2015-09-16', return_date: '', movie_title: 'Wait Until Dark', customer_id: 9 },
          { checkout_date: '2015-03-16', return_date: '2015-03-20', movie_title: 'North by Northwest', customer_id: 2 },
          { checkout_date: '2015-08-10', return_date: '', movie_title: 'Jaws', customer_id: 1 }
        ]
      }

      numRentalsSeeded = data.rentals.length;

      resetTables(data, done);
    });

    it('returns all rentals sorted by return_date', function(done) {
      rental.sortBy('return_date', null, null, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, numRentalsSeeded);
        assert.equal(rows[0].return_date, "");
        assert.equal(rows[0].movie_title, 'Wait Until Dark');
        done();
      });
    });

    it('returns 1 rental sorted by customer_id', function(done) {
      rental.sortBy('customer_id', 1, null, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].id, 3)
        assert.equal(rows[0].customer_id, 1);
        done();
      });
    });

    it('returns 1 rental sorted by customer_id from the second page', function(done) {
      rental.sortBy('customer_id', 1, 2, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].customer_id, 2);
        done();
      });
    });
  });

  describe('#checkIn', function() {
    beforeEach(function(done) {
      var data = {
        rentals: [
          { checkout_date: '2015-03-16', return_date: '2015-03-20', movie_title: 'North by Northwest', customer_id: 2 },
          { checkout_date: '2015-09-16', return_date: '', movie_title: 'Wait Until Dark', customer_id: 9 },
          { checkout_date: '2015-08-23', return_date: '', movie_title: 'Wait Until Dark', customer_id: 4},
          { checkout_date: '2015-08-10', return_date: '', movie_title: 'Jaws', customer_id: 1 }
        ]
      }

      resetTables(data, done);
    });

    it('checks in a rental by adding a return date', function(done) {
      var movie_title = 'Wait Until Dark';
      var customer_id = 4;
      var date = '2015-09-20';

      rental.checkIn(movie_title, date, customer_id, function(err, res) {
        assert.equal(err, undefined);
        assert.equal(res.changed, 1);

        rental.findBy('customer_id', 4, function(err, row) {
          assert.equal(err, undefined);
          assert.equal(row[0].return_date, '2015-09-20');

          rental.findBy('customer_id', 9, function(err, row) {
            assert.equal(err, undefined);
            assert.equal(row[0].return_date, '');
            done();
          });
        });
      });
    });
  });

  describe('#checkOut', function() {
    var validRentalData;

    beforeEach(function(done) {
      var data = {
        customers: [
          { name: 'Customer0', account_balance: 200 },
          { name: 'Customer1', account_balance: 650 },
          { name: 'Customer3', account_balance: 1000 },
        ],
        movies: [ { title: 'Movie1', inventory: 1 } ]
      }
      resetTables(data, done)

      validRentalData = { checkout_date: '2015-03-16', movie_title: 'Movie1', customer_id: '2' };
    });

    it('creates a new rental record', function(done) {
      rental.checkOut(validRentalData, function(err, res) {
        assert.equal(err, undefined);
        assert.equal(res.insertedRentalID, 1);
        assert.equal(res.changes, 2);
        rental.all(function(err, res) {
          assert.equal(res.length, 1);
          done();
        });
      });
    });

    it("subtracts 250 from the customer's balance", function(done) {
      rental.checkOut(validRentalData, function(err, res) {
        new Customer().findBy('id', 2, function(err2, res2) {
          assert.equal(err, undefined);
          assert.equal(res2.length, 1);
          assert.equal(res2[0].account_balance, 400);
          done();
        });
      });
    });
  });
});
