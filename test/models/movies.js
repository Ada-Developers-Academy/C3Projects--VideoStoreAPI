var assert = require('assert'),
    Movie  = require('../../models/movies'),
    sqlite3 = require('sqlite3').verbose();

describe("movie model", function() {
  var movie, test_db;

  beforeEach(function(done) {
    movie = new Movie();

    test_db = new sqlite3.Database('db/test.db');
    test_db.serialize(function() {
      test_db.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory) \
        VALUES('Amelie', 'sad French girl. you know', '2005-12-12', 5), \
              ('Alien', 'something about aliens', '1997-11-11', 2), \
              ('Jaws', 'something about a shark', '1999-10-10', 3), \
              ('Moneyball', 'something about baseball', '2007-11-11', 6); \
        COMMIT;"
        , function(err) {
          test_db.close();
          done();
        }
      );
    });
  })

  it("can be instantiated", function() {
    assert(movie instanceof Movie);
  })

  describe("instance methods", function() {
    it("can find all movies", function(done) {
      movie.all(function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 4); // amelie, alien, jaws, moneyball

        assert.equal(res[0].title, 'Amelie');
        assert.equal(res[1].title, 'Alien');

        done();
      })
    })

    it("can find some of the movies", function(done) {
      movie.some("id", 2, 2, function(error, result) {
        assert.equal(error, undefined);
        assert(result instanceof Array);
        assert.equal(result.length, 2); //jaws, moneyball

        var expected_titles = ['Jaws', 'Moneyball'],
            actual_titles = [];

        for(var index in result) {
          actual_titles.push(result[index].title);
        }

        assert.deepEqual(expected_titles, actual_titles);
        done();
      })
    })

    it("can put some of the movies in title order", function(done) {
      movie.some("title", 2, 1, function(error, result) {
        assert.equal(error, undefined);
        assert(result instanceof Array);
        assert.equal(result.length, 2); //amelie jaws

        var expected_titles = ['Amelie', 'Jaws'],
            actual_titles = [];

        for(var index in result) {
          actual_titles.push(result[index].title);
        }

        assert.deepEqual(expected_titles, actual_titles);

        done();
      })
    })
  })
})
