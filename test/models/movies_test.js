"use strict";

var assert = require("assert");
var Movie = require('../../models/movies');
var sqlite3 = require('sqlite3').verbose();

describe('Movie', function() {
  var movie;
  var numSeeded = 2;
  var expectedPath = "db/test.db";

  beforeEach(function(done) {
    movie = new Movie();
    resetMoviesTable(done);
  });

  it("can be instantiated", function() {
    assert(movie instanceof Movie);
  });

  it("holds onto the `path` to the database", function() {
    assert.equal(movie.dbPath(), expectedPath);
  });

  describe('#create', function() {
    it('creates a new movie record', function(done) {
      var data = {
       title: 'RoboJaws',
       overview: 'Jaws is hunted by RoboJaws',
       release_date: 'Tomorrow',
       inventory: 10
     }

      movie.create(data, function(err, res) {
        assert.equal(err, undefined);
        assert.equal(res.insertedID, numSeeded + 1);
        assert.equal(res.changed, 1);
        done();
      });
    });
  });

  describe('#all', function() {
    it('returns all movies', function(done) {
      movie.all(function(err, rows){
        assert.equal(err, undefined);
        assert.equal(rows.length, numSeeded);
        done();
      });
    });
  });

  describe('#findBy', function() {
    // because of how we seeded the db, this also tests that it will only return exact title matches
    it('returns 1 movie where the name is Jaws', function(done) {
      movie.findBy('title', 'Jaws', function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        done();
      });
    });

    it('"JAWS" returns movie with title "Jaws"', function(done) {
      movie.findBy('title', 'JAWS', function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].title, 'Jaws');
        done();
      });
    });
  });
});

function resetMoviesTable(done) {
  // NOTE: we need to maintain these titles (where 'Jaws' is in both)
  //       in order to test that only exact matches are returned in #findBy
  var db = new sqlite3.Database('db/test.db');
  db.serialize(function() {
    db.exec(
      "BEGIN; \
      DELETE FROM movies; \
      INSERT INTO movies(title, overview, release_date, inventory) \
      VALUES('Jaws', 'Shark!', 'Yesterday', 10), \
            ('Jaws and Maws', 'Worm!', 'Yesterday', 11); \
      COMMIT;",
      function(err) {
        db.close();
        done();
      }
    );
  });
}
