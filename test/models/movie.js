 var assert = require('assert'),
    Movie  = require('../../models/movie'),
    sqlite3 = require('sqlite3').verbose();

describe("Movie", function() {
  var movie, db_cleaner

  beforeEach(function(done) {
    movie = new Movie();

    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec("BEGIN; DELETE FROM movies; INSERT INTO movies(title, overview, release_date, inventory, available) VALUES('X-files: I want to believe', 'Mulder and Scully rock it', '1999', 4, 4), ('The Lone Gunmen', 'misadventures of the best nerds', '2001', 5, 5); COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  })

  it("can be instantiated", function() {
    assert(movie instanceof Movie);
  });

  describe("instance methods", function() {
    it("can find all movies", function(done) {
      movie.find_all(function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 2);

        assert.equal(res[0].title, 'X-files: I want to believe');
        assert.equal(res[1].title, 'The Lone Gunmen');

        done();
      });
    });

    it("can find a subset of movies", function(done) {
      movie.find_subset('title', 1, 1, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 1);

        assert.equal(res[0].title, 'X-files: I want to believe');

        done();
      });
    });
  });
});

