var assert = require("assert"),
    Movie = require('../../models/movie'),
    sqlite3 = require('sqlite3').verbose();


describe("Movie", function() {
  beforeEach(function(){
    movie = new Movie();
  })

  it("can be instantiated", function(){
    assert.equal(movie instanceof Movie, true);
  })

  it("has a find_by property that is a function", function() {
    assert.equal(typeof movie.find_by, "function");
  })

  it("has a 'find_all' property that is a function", function() {
    assert.equal(typeof movie.find_all, "function");
  })

  it("has a 'sort_by' property that is a function", function() {
    assert.equal(typeof movie.sort_by, "function");
  });

  describe("movie queries", function(){
    beforeEach(function(done){
      movie = new Movie();

      db_cleaner = new sqlite3.Database('db/test.db');

      db_cleaner.serialize(function(){
        db_cleaner.exec(
          "BEGIN; \
          DELETE FROM movies; \
          INSERT INTO movies(title, overview, release_date, inventory, available) \
          VALUES('Jaws', 'Shark!', 'Yesterday', 10, 10), \
                ('Aws', 'Shark!', 'Yesterday', 10, 10), \
                ('Waws', 'Worm!', 'Yesterday', 11, 0), \
                ('Maws', 'Worm!', 'Yesterday', 11, 11); \
          COMMIT;",
          function(err) {
            db_cleaner.close();
            done();
          }
        );
      })
    })

    it("finds 'Jaws' title in the movies table", function(done) {
      movie.find_by('title', "Jaws", function(err, result){
        assert.equal(result[0].title, 'Jaws');
        done();
      });

    });

    it("displays all records from movies table", function(done) {
      movie.find_all(function(err, result) {
        assert.equal(result.length, 4);
        done();
      });
    })

    it("displays all records from 'movies' table, sorted by title with limit 2", function(done) {
      movie.sort_by("title", 2, 0, function(err, result) {
        assert.equal(result[0].title, 'Aws');
        assert.equal(result[1].title, 'Jaws');
        assert.equal(result.length, 2);
        done();
      });
    })

    it("displays 10 available 'Jaws' movie", function(done) {
      movie.available("Jaws", function(err, result) {
        assert.equal(result[0].title, 'Jaws');
        assert.equal(result[0].available, 10);
        done();
      });
    })
  })
});
