var assert = require('assert'),
    Movie  = require('../../models/movie'),
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
        INSERT INTO movies(title, overview, release_date, inventory) \
        VALUES('Jaws', 'Shark!', '2015', 10), \
              ('Paws', 'Cat!', '1989', 10), \
              ('Maws', 'Worm!', '2009', 11); \
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
    it("can find a movie by id", function(done){
      movie.find_by("id", 1, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Object);
        assert.equal(res.id, 1);
        done();
      });
    });

    it("can find a movie by title", function(done) {
      movie.find_by("title", "Jaws", function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Object);
        assert.equal(res.title, 'Jaws');
        done();
      });
    });

    it("can find all movies where a column has a particular value", function(done) {
      movie.where(["title"], ["Jaws"], function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Object);
        assert.equal(res.length, 1);
        assert.equal(res[0].title, "Jaws");
        done();
      });
    });

    it("can find all movies with specified column=value(s)", function(done) {
      var column = 'inventory';
      var values = ['10'];
      movie.where_in(column, values, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 2);
        assert.equal(res[0].title, 'Jaws');
        assert.equal(res[1].title, 'Paws');
        done();
      });
    });

    it("can return a subset of movies sorted by title", function(done){
      var queries = [1, 0] // number, offset
      movie.subset("title", queries, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res[0].id, 1);
        assert.equal(res[0].title, "Jaws");
        done();
      });
    });

    it("can return a subset of movies sorted by release_date", function(done){
      var queries = [1, 0] // number, offset
      movie.subset("release_date", queries, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res[0].id, 2);
        assert.equal(res[0].release_date, "1989");
        done();
      });
    });
  });

  describe("class methods", function() {
    it("can create a new movie in the database", function(done) {
      var columns = ['title', 'overview', 'release_date', 'inventory'];
      var values = ['The X-Files: Fight the Future', 'A supercool movie.', 
        '1998', 3];

      movie.create(columns, values, function(err, res) {
        assert.equal(res.inserted_id, 4); //it inserted a new record

        movie.find_by("title", "The X-Files: Fight the Future", function(err, res) {
          assert.equal(res.title, "The X-Files: Fight the Future"); //we found our new movie
          done();
        });
      });
    });

    it("can update a movie record", function(done) {
      var id = 1;
      var columns = ['title', 'release_date'];
      var values = ['The X-Files: I Want to Believe', '2008'];

      movie.update(id, columns, values, function(err, res) {
        assert.equal(res.changes, 1);

        movie.find_by("title", "Maws", function(err, res) {
          assert.equal(res, undefined); //we can't find by old name
        });

        movie.find_by("title", 'The X-Files: I Want to Believe', function(err, res) {
          assert.equal(res.title, 'The X-Files: I Want to Believe');
          done();
        });
      });
    });
  });
});
