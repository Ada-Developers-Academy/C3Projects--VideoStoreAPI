var assert = require('assert');
var Movie  = require('../../models/movie');
var sqlite3 = require('sqlite3').verbose();

describe("Movie", function() {
  var movie, db_cleaner

  beforeEach(function(done) {
    movie = new Movie();

    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory) \
        VALUES('Jaws', 'Shark!', 'Yesterday', 10), \
              ('Maws', 'Worm!', 'Yesterday', 11); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  })

  it("can be instantiated", function() {
    assert(movie instanceof Movie);
  })
})
