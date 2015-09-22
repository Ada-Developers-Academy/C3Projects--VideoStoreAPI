"use strict";

var assert = require("assert");
var Movie = require('../../models/movie');
var sqlite3 = require('sqlite3').verbose();

describe('Movie', function() {
  var movie;
  var numSeeded = 2;
  var expectedPath = "db/test.db";
  var validMovieData = function validMovieData() {
    return {
      title: 'RoboJaws',
      overview: 'Jaws is hunted by RoboJaws',
      release_date: 'Tomorrow',
      inventory: 10
    };
  };

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
      var data = validMovieData();

      movie.create(data, function(err, res) {
        assert.equal(err, undefined);
        assert.equal(res.insertedID, numSeeded + 1);
        assert.equal(res.changed, 1);
        done();
      });
    });

    it('requires a title', function(done) {
      var data = validMovieData();
      delete data.title;

      movie.create(data, function(err, res) {
        assert.equal(err.errno, 19);
        assert.equal(err.message, 'SQLITE_CONSTRAINT: NOT NULL constraint failed: movies.title');
        done();
      });
    });

    it('requires a title to be unique', function(done) {
      var data = validMovieData();

      movie.create(data, function(err, res) {
        assert.equal(err, undefined);
        assert.equal(res.insertedID, numSeeded + 1);
        assert.equal(res.changed, 1);

        movie.create(data, function(err, res) {
          assert.equal(err.errno, 19);
          assert.equal(err.message, 'SQLITE_CONSTRAINT: UNIQUE constraint failed: movies.title');
          done();
        });
      });
    });

    it('defaults inventory to zero', function(done) {
      var data = validMovieData();
      delete data.inventory;

      movie.create(data, function(err, res) {
        assert.equal(err, undefined);
        assert(res.insertedID, numSeeded + 1);
        movie.findBy('id', res.insertedID, function(err, rows) {
          assert.equal(rows.length, 1);
          assert.equal(rows[0].inventory, 0);
          done();
        });
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
        assert.equal(rows[0].title, 'Jaws');
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

    it('returns an error when an unrecognized column is provided', function(done) {
      movie.findBy('badColumnName', 'Jaws', function(err, rows) {
        assert(err);
        assert.equal(err.message, 'Error: syntax error. Unrecognized parameter.');
        assert.equal(rows, undefined);
        done();
      });
    });
  });

  describe('#sortBy', function() {
    it('returns all movies sorted by title', function(done) {
      movie.sortBy('title', 'all', function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, numSeeded);
        assert.equal(rows[0].title, 'Jaws');
        done();
      });
    });

    it('returns all movies sorted by release_date', function(done){
      movie.sortBy('release_date', 'all', function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, numSeeded);
        assert.equal(rows[0].release_date, '1975-06-19');
        done();
      });
    });

    it('returns 1 movies sorted by title', function(done) {
      movie.sortBy('title', 1, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].title, 'Jaws');
        done();
      });
    });

    it('returns 1 movie sorted by release_date', function(done){
      movie.sortBy('release_date', 1, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].release_date, '1975-06-19');
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
      VALUES('Jaws', 'Shark!', '1975-06-19', 10), \
            ('Jaws and Maws', 'Worm!', 'Yesterday', 11); \
      COMMIT;",
      function(err) {
        db.close();
        done();
      }
    );
  });
}
