"use strict";

var assert = require("assert");
var Rental = require('../../models/rentals');
var sqlite3 = require('sqlite3').verbose();

describe('Rental', function() {
  var rental;
  var expectedPath = "db/test.db";

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
      var data = {
       checkout_date: '2014-12-16',
       return_date: '',
       movie_title: 'The Great Escape',
       customer_id: 15
     }

      rental.create(data, function(err, res) {
        assert.equal(err, undefined);
        assert.equal(res.insertedID, 3);
        assert.equal(res.changed, 1);
        done();
      });
    });
  });

  describe('#update', function() {
    it('updates a rental record', function(done) {
      var movie_title = 'Wait Until Dark';

      var date = '2015-09-20';

      rental.update(movie_title, date, function(err, res) {
        assert.equal(err, undefined);
        assert.equal(res.changed, 1);
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
      VALUES('2015-03-16', '015-03-20', 'North by Northwest', 2), \
            ('2015-09-16', '', 'Wait Until Dark', 9); \
      COMMIT;",
      function(err) {
        db.close();
        done();
      }
    );
  });
}
