 var assert = require('assert'),
    Movie  = require('../../models/movie'),
    sqlite3 = require('sqlite3').verbose();

describe("Movie", function() {
  var movie, db_cleaner

  beforeEach(function(done) {
    movie = new Movie();

    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec("BEGIN; DELETE FROM movies; DELETE FROM rentals; INSERT INTO movies(title, overview, release_date, inventory, available) VALUES('X-files: I want to believe', 'Mulder and Scully rock it', '2007', 4, 3), ('The Lone Gunmen', 'misadventures of the best nerds', '2001', 5, 5), ('Fight the Future', 'a bee ruins everything', '1998', 7, 7); INSERT INTO rentals(movie_id, customer_id, returned_date, due_date, checked_out) VALUES(1, 1, '', '2015-09-10', '2015-09-01'), (2, 2, '2015-09-30', '2015-10-01', '2015-09-15'); COMMIT;"
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
        assert.equal(res.length, 3);

        assert.equal(res[0].title, 'X-files: I want to believe');
        assert.equal(res[1].title, 'The Lone Gunmen');

        done();
      });
    });

    it("can find a subset of movies", function(done) {
      movie.find_subset('release_date', 50, 0, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 3);
        assert.equal(res[0].title, 'Fight the Future');

        done();
      });
    });

    it("can find customers who currently have a rental for that movie", function(done) {
      movie.movie_current_customers('X-files: I want to believe', function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 1);

        assert.equal(res[0].name, 'Mulder');

        done();
      });
    });

    it("can find customers who have a past rental for that movie", function(done) {
      movie.movie_past_customers('The Lone Gunmen', 'name', function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 1);

        assert.equal(res[0].name, 'Scully');

        done();
      });
    });
  });
});

