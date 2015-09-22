"use strict";

var assert = require("assert");
var Rental = require('../../models/rental');
var sqlite3 = require('sqlite3').verbose();

describe('Rental', function() {
  var rental;
  var expectedPath = "db/test.db";
  var numSeeded = 3;
  var validRentalData = function validRentalData() {
    return {
      checkout_date: '2014-12-16',
      return_date: '',
      movie_title: 'The Great Escape',
      customer_id: 15
    };
  };

  beforeEach(function(done) {
    rental = new Rental();

    resetRentalsTable(done);
  });

  it("can be instantiated", function() {
    assert(rental instanceof Rental);
  });

  it("holds onto the `path` to the database", function() {
    assert.equal(rental.dbPath(), expectedPath);
  });

  describe('#create', function() {
    it('creates a new rental record', function(done) {
      var data = validRentalData();

      rental.create(data, function(err, res) {
        assert.equal(err, undefined);
        assert.equal(res.insertedID, numSeeded + 1);
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
        assert(res.insertedID, numSeeded + 1);

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
    it('returns all rentals', function(done) {
      rental.all(function(err, rows){
        assert.equal(err, undefined);
        assert.equal(rows.length, numSeeded);
        done();
      });
    });
  });

  describe('#findBy', function() {
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
    it('returns all rentals sorted by return_date', function(done) {
      rental.sortBy('return_date', null, null, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, numSeeded);
        assert.equal(rows[0].return_date, "2015-03-20");
        assert.equal(rows[0].movie_title, 'North by Northwest');
        done();
      });
    });

    it('returns 1 rental sorted by customer_id', function(done) {
      rental.sortBy('customer_id', 1, null, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].customer_id, 2);
        done();
      });
    });

    it('returns 1 rental sorted by customer_id from the second page', function(done) {
      rental.sortBy('customer_id', 1, 2, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].customer_id, 9);
        done();
      });
    });
  });

  describe('#checkIn', function() {
    it('checks in a rental by adding a return date', function(done) {
      var movie_title = 'Wait Until Dark';

      var date = '2015-09-20';

      rental.checkIn(movie_title, date, function(err, res) {
        assert.equal(err, undefined);
        assert.equal(res.changed, 1);

        rental.findBy('movie_title', 'Wait Until Dark', function(err, row) {
          assert.equal(err, undefined);
          assert.equal(row[0].return_date, '2015-09-20');
        });
        done();
      });
    });
  })
});

function resetRentalsTable(done) {
  var db = new sqlite3.Database('db/test.db');
  db.serialize(function() {
    db.exec(
      "BEGIN; \
      DELETE FROM rentals; \
      INSERT INTO rentals(checkout_date, return_date, movie_title, customer_id) \
      VALUES('2015-03-16', '2015-03-20', 'North by Northwest', 2), \
            ('2015-09-16', '', 'Wait Until Dark', 9), \
            ('2015-08-10', '', 'Jaws', 1); \
      COMMIT;",
      function(err) {
        db.close();
        done();
      }
    );
  });
}
