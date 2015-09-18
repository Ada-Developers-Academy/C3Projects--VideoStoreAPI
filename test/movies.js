var assert = require('assert'),
    Movie  = require('../models/movie'),
    sqlite3 = require('sqlite3').verbose();

describe("Movie", function() {
  var movie, db_cleaner;

  beforeEach(function(done) {
    movie = new Movie();

    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory, num_available) \
        VALUES('Jaws', 'Shark!', 'Yesterday', 10, 8), \
              ('Maws', 'Worm!', 'Yesterday', 11, 4); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  it("can be instantiated", function() {
    assert(movie instanceof Movie);
  });

  describe("instance methods", function() {
    context("GET #find_all", function() {
      it("retrieves all movie records", function(done) {
        movie.find_all(function(err, res) {
          assert.equal(err, undefined);
          assert(res instanceof Array);
          assert.equal(res.length, 2);
          assert.equal(res[0].title, 'Jaws');
          done();
        });
      });
    });
  });
});
